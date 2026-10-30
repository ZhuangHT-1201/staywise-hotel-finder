import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const errors = [];

async function preparePage(viewport) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  return page;
}

const desktop = await preparePage({ width: 1440, height: 1000 });
await desktop.screenshot({ path: "artifacts/desktop-full.png", fullPage: true });
await desktop.screenshot({ path: "artifacts/desktop-fold.png", fullPage: false });
const initialCardCount = await desktop.locator(".hotel-card").count();

const destination = desktop.getByLabel("目的地");
await destination.fill("北航沙河");
await desktop.waitForTimeout(180);
assert(await desktop.getByRole("option", { name: /北京航空航天大学沙河校区/ }).isVisible());
await desktop.getByRole("option", { name: /北京航空航天大学沙河校区/ }).click();
await desktop.getByRole("button", { name: "帮我找酒店" }).click();
await desktop.waitForTimeout(250);
assert.match(await desktop.locator(".results-location").innerText(), /沙河/);
await desktop.screenshot({ path: "artifacts/location-search.png", fullPage: false });

await desktop.locator(".hotel-card").first().locator(".heart-button").click();
await desktop.locator(".hotel-card").nth(0).locator(".compare-button").click();
await desktop.locator(".hotel-card").nth(1).locator(".compare-button").click();
await desktop.locator(".dock-compare").click();
await desktop.waitForTimeout(450);
await desktop.screenshot({ path: "artifacts/compare-modal.png", fullPage: false });
await desktop.locator(".compare-modal .modal-close").click();

await desktop.locator(".hotel-card").first().locator(".detail-link").click();
await desktop.waitForTimeout(450);
await desktop.screenshot({ path: "artifacts/hotel-modal.png", fullPage: false });
await desktop.locator(".hotel-modal .modal-close").click();

await desktop.locator(".hotel-card").first().locator(".detail-link").click();
await desktop.locator(".alert-outline-button").click();
await desktop.locator(".alert-modal input").fill("199");
await desktop.locator(".alert-save-button").click();
await desktop.locator(".header-actions .header-icon-button").first().click();
await desktop.waitForTimeout(250);
assert.match(await desktop.locator(".saved-drawer").innerText(), /目标\s*¥199/);
await desktop.locator(".saved-drawer__head button").click();

await desktop.locator(".search-mode-tabs button").nth(1).click();
await desktop.getByLabel("我的位置").fill("北京航空航天大学沙河校区");
await desktop.getByLabel("TA 的位置").fill("三里屯太古里");
await desktop.getByRole("button", { name: "帮我找酒店" }).click();
await desktop.waitForTimeout(250);
assert(await desktop.locator(".meetup-route-summary").isVisible());
await desktop.screenshot({ path: "artifacts/date-midpoint-zh.png", fullPage: false });

await desktop.locator(".language-toggle").click();
await desktop.waitForTimeout(200);
assert.match(await desktop.title(), /StayWise/);
await desktop.locator(".search-mode-tabs button").first().click();
await desktop.getByLabel("Destination").fill("Beihang University Shahe");
await desktop.waitForTimeout(150);
await desktop
  .getByRole("option", { name: /Beihang University Shahe Campus/ })
  .click();
await desktop.getByRole("button", { name: "Find my hotel" }).click();
await desktop.waitForTimeout(3200);
const englishBody = await desktop.locator("body").innerText();
const bodyWithoutToggle = englishBody.replace("中文", "");
assert.doesNotMatch(bodyWithoutToggle, /[\u4e00-\u9fff]/);
if (await desktop.locator(".dock-clear").isVisible()) {
  await desktop.locator(".dock-clear").click();
}
await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.waitForTimeout(180);
await desktop.screenshot({ path: "artifacts/english-home-fold.png", fullPage: false });
await desktop.screenshot({ path: "artifacts/english-home-full.png", fullPage: true });

await desktop.locator(".hotel-card").first().locator(".detail-link").click();
await desktop.waitForTimeout(400);
assert.match(await desktop.locator(".hotel-modal").innerText(), /Why this hotel/);
await desktop.screenshot({ path: "artifacts/english-hotel-detail.png", fullPage: false });
await desktop.locator(".hotel-modal .modal-close").click();

await desktop.locator(".search-mode-tabs button").nth(1).click();
await desktop.getByLabel("My place").fill("Beihang University Shahe Campus");
await desktop.getByLabel("Their place").fill("Taikoo Li Sanlitun");
await desktop.getByRole("button", { name: "Find my hotel" }).click();
await desktop.waitForTimeout(250);
await desktop.screenshot({ path: "artifacts/english-date-midpoint.png", fullPage: false });
await desktop.screenshot({ path: "artifacts/english-date-midpoint-full.png", fullPage: true });

const desktopOverflow = await desktop.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
);

const mobile = await preparePage({ width: 390, height: 844 });
await mobile.screenshot({ path: "artifacts/mobile-fold.png", fullPage: false });
await mobile.screenshot({ path: "artifacts/mobile-full.png", fullPage: true });
const mobileOverflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
);
await mobile.locator(".mobile-filter-trigger").click();
await mobile.waitForTimeout(350);
await mobile.screenshot({ path: "artifacts/mobile-filter.png", fullPage: false });
await mobile.getByRole("button", { name: "4.8+" }).click();
await mobile.locator(".mobile-filter-done").click();
await mobile.waitForTimeout(250);
const filteredCardCount = await mobile.locator(".hotel-card").count();
assert(filteredCardCount > 0 && filteredCardCount < initialCardCount);

await mobile.locator(".mobile-filter-trigger").click();
await mobile.locator(".filter-sidebar__heading button").click();
await mobile.waitForTimeout(200);
await mobile.locator(".language-toggle").click();
await mobile.waitForTimeout(200);
await mobile.evaluate(() => window.scrollTo(0, 0));
await mobile.screenshot({ path: "artifacts/english-mobile-full.png", fullPage: true });

console.log(
  JSON.stringify(
    {
      title: await desktop.title(),
      initialCardCount,
      filteredCardCount,
      desktopOverflow,
      mobileOverflow,
      errors,
    },
    null,
    2,
  ),
);

await browser.close();
