import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  Check,
  ChevronDown,
  Compass,
  Filter,
  Heart,
  Languages,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  TrendingDown,
} from "lucide-react";
import SearchPanel from "./components/SearchPanel";
import FilterSidebar from "./components/FilterSidebar";
import HotelCard from "./components/HotelCard";
import PriceInsights from "./components/PriceInsights";
import {
  AlertModal,
  CompareDock,
  CompareModal,
  HotelDetailModal,
  SavedDrawer,
  Toast,
} from "./components/Overlays";
import { getHotelsForDestination, supportedCities } from "./data/hotels";
import {
  cityMeta,
  formatDistance,
  getDistanceKm,
  getMidpoint,
  placeName,
  resolvePlace,
} from "./data/locations";
import {
  addDays,
  applySearchDistances,
  calculateNights,
  formatDate,
  getPlatformSearchUrl,
  preferenceOptions,
  rankHotels,
  sortOptions,
  todayISO,
} from "./utils/hotelLogic";
import { useLanguage } from "./i18n";

const initialToday = todayISO();
const initialSearch = {
  destination: "北京航空航天大学沙河校区",
  secondaryDestination: "三里屯太古里",
  mode: "single",
  checkIn: addDays(initialToday, 7),
  checkOut: addDays(initialToday, 9),
  guests: 2,
  rooms: 1,
  preference: "value",
  cityHint: "北京",
  today: initialToday,
};

const initialFilters = {
  maxPrice: 1600,
  minRating: 0,
  breakfast: false,
  freeCancel: false,
  favoritesOnly: false,
};

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const {
    lang,
    toggleLanguage,
    bi,
    number,
    city,
    hotelName,
    provider,
  } = useLanguage();
  const [draft, setDraft] = useState(initialSearch);
  const [applied, setApplied] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState("recommended");
  const [formError, setFormError] = useState("");
  const [detailHotel, setDetailHotel] = useState(null);
  const [compareHotels, setCompareHotels] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [alertHotel, setAlertHotel] = useState(null);
  const [savedDrawer, setSavedDrawer] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [alerts, setAlerts] = useStoredState("zhudezhi-alerts", []);
  const [favorites, setFavorites] = useStoredState("zhudezhi-favorites", []);

  const nights = calculateNights(applied.checkIn, applied.checkOut);
  const primaryPlace = useMemo(
    () => resolvePlace(applied.destination, applied.cityHint || "上海"),
    [applied.cityHint, applied.destination],
  );
  const secondaryPlace = useMemo(
    () =>
      applied.mode === "between" && applied.secondaryDestination
        ? resolvePlace(applied.secondaryDestination, primaryPlace.city)
        : null,
    [applied.mode, applied.secondaryDestination, primaryPlace.city],
  );
  const resolvedCity = primaryPlace.city;
  const focusPlace =
    applied.mode === "between" ? getMidpoint(primaryPlace, secondaryPlace) : primaryPlace;
  const allHotels = useMemo(
    () =>
      applySearchDistances(
        getHotelsForDestination(resolvedCity),
        primaryPlace,
        secondaryPlace,
        applied.mode,
      ),
    [applied.mode, primaryPlace, resolvedCity, secondaryPlace],
  );
  const rankedHotels = useMemo(
    () => rankHotels(allHotels, applied.preference),
    [allHotels, applied.preference],
  );
  const favoriteIds = useMemo(
    () => new Set(favorites.map((hotel) => hotel.id)),
    [favorites],
  );

  const visibleHotels = useMemo(() => {
    const filtered = rankedHotels.filter(
      (hotel) =>
        hotel.bestPrice <= filters.maxPrice &&
        hotel.rating >= filters.minRating &&
        (!filters.breakfast || hotel.breakfast) &&
        (!filters.freeCancel || hotel.freeCancel) &&
        (!filters.favoritesOnly || favoriteIds.has(hotel.id)),
    );

    if (sort === "price") return [...filtered].sort((a, b) => a.bestPrice - b.bestPrice);
    if (sort === "rating") return [...filtered].sort((a, b) => b.rating - a.rating);
    if (sort === "distance") {
      return [...filtered].sort((a, b) => a.locationDistanceKm - b.locationDistanceKm);
    }
    return filtered;
  }, [favoriteIds, filters, rankedHotels, sort]);

  const heroPick = rankedHotels[0];
  const searchUrl = useMemo(
    () =>
      getPlatformSearchUrl(
        cityMeta[resolvedCity]?.en ?? resolvedCity,
        applied.checkIn,
        applied.checkOut,
        applied.guests,
        applied.rooms,
      ),
    [applied.checkIn, applied.checkOut, applied.guests, applied.rooms, resolvedCity],
  );
  const pairDistance =
    secondaryPlace && primaryPlace.city === secondaryPlace.city
      ? getDistanceKm(primaryPlace, secondaryPlace)
      : null;

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function handleSearch() {
    if (!draft.destination.trim()) {
      setFormError(bi("请先输入一个具体地点。", "Enter a specific place first."));
      return;
    }
    if (draft.mode === "between" && !draft.secondaryDestination.trim()) {
      setFormError(
        bi("双点约会模式需要填写第二个地点。", "Add a second place for date midpoint search."),
      );
      return;
    }
    if (draft.checkOut <= draft.checkIn) {
      setFormError(
        bi("退房日期需要晚于入住日期。", "Check-out must be after check-in."),
      );
      return;
    }

    const nextPrimary = resolvePlace(draft.destination, draft.cityHint || "上海");
    const nextSecondary =
      draft.mode === "between"
        ? resolvePlace(draft.secondaryDestination, nextPrimary.city)
        : null;
    if (
      nextSecondary &&
      nextSecondary.city !== nextPrimary.city
    ) {
      setFormError(
        bi(
          `两个地点分别位于${city(nextPrimary.city)}和${city(nextSecondary.city)}，请选择同一城市内的地点。`,
          `The two places are in ${city(nextPrimary.city)} and ${city(
            nextSecondary.city,
          )}. Choose places in the same city.`,
        ),
      );
      return;
    }

    setFormError("");
    setApplied({
      ...draft,
      destination: draft.destination.trim(),
      secondaryDestination: draft.secondaryDestination.trim(),
      cityHint: nextPrimary.city,
    });
    setDraft((current) => ({ ...current, cityHint: nextPrimary.city }));
    setFilters((current) => ({ ...current, favoritesOnly: false }));
    setSort("recommended");
    window.setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function handlePreferenceChange(preference) {
    setDraft((current) => ({ ...current, preference }));
    setApplied((current) => ({ ...current, preference }));
  }

  function handleFavorite(hotel) {
    const exists = favoriteIds.has(hotel.id);
    setFavorites((current) =>
      exists ? current.filter((favorite) => favorite.id !== hotel.id) : [...current, hotel],
    );
    setToast(
      exists
        ? bi("已从收藏中移除", "Removed from favorites")
        : bi("已加入我的收藏", "Saved to favorites"),
    );
  }

  function handleCompare(hotel) {
    const exists = compareHotels.some((item) => item.id === hotel.id);
    if (exists) {
      setCompareHotels((current) => current.filter((item) => item.id !== hotel.id));
      return;
    }
    if (compareHotels.length >= 3) {
      setToast(bi("最多同时对比 3 家酒店", "Compare up to 3 hotels"));
      return;
    }
    setCompareHotels((current) => [...current, hotel]);
  }

  function handleRemoveCompare(hotel) {
    setCompareHotels((current) => current.filter((item) => item.id !== hotel.id));
  }

  function handleSaveAlert(target) {
    if (!alertHotel) return;
    const id = `${alertHotel.id}-${applied.checkIn}`;
    const nextAlert = {
      id,
      target,
      hotel: alertHotel,
      checkIn: applied.checkIn,
      checkOut: applied.checkOut,
      createdAt: new Date().toISOString(),
    };
    setAlerts((current) => [nextAlert, ...current.filter((alert) => alert.id !== id)]);
    setAlertHotel(null);
    setToast(bi("价格提醒已保存在当前浏览器", "Price alert saved in this browser"));
  }

  function handleProviderClick(offer, hotel) {
    const targetUrl =
      offer.name === "Booking"
        ? getPlatformSearchUrl(
            cityMeta[hotel.city]?.en ?? hotel.city,
            applied.checkIn,
            applied.checkOut,
            applied.guests,
            applied.rooms,
          )
        : offer.url;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setToast(
      bi(
        `已打开 ${provider(offer.name)}，请按酒店名和日期核对实时价`,
        `Opened ${provider(offer.name)}. Verify the hotel and dates live.`,
      ),
    );
  }

  const activePreference = preferenceOptions[applied.preference];

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="brand-mark">
              <Building2 size={19} />
            </span>
            <span>
              <strong>{bi("住得值", "StayWise")}</strong>
              <small>SMART HOTEL</small>
            </span>
          </button>

          <nav className="main-nav" aria-label={bi("主导航", "Main navigation")}>
            <button
              className="active"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {bi("找酒店", "Find hotels")}
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {bi("省钱雷达", "Price radar")}
            </button>
            <button type="button" onClick={() => setSavedDrawer("alerts")}>
              {bi("价格追踪", "Price tracker")}
            </button>
          </nav>

          <div className="header-actions">
            <button
              className="header-icon-button"
              type="button"
              onClick={() => setSavedDrawer("alerts")}
            >
              <Bell size={17} />
              <span>{bi("提醒", "Alerts")}</span>
              {alerts.length > 0 && <b>{alerts.length}</b>}
            </button>
            <button
              className="header-icon-button"
              type="button"
              onClick={() => setSavedDrawer("favorites")}
            >
              <Heart size={17} />
              <span>{bi("收藏", "Saved")}</span>
              {favorites.length > 0 && <b>{favorites.length}</b>}
            </button>
            <button
              className="language-toggle"
              type="button"
              onClick={toggleLanguage}
              aria-label={bi("Switch to English", "切换为中文")}
            >
              <Languages size={16} />
              {lang === "zh" ? "EN" : "中文"}
            </button>
            <span className="demo-pill">
              <span />
              {bi("演示版", "DEMO")}
            </span>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span>
                  <Sparkles size={15} />
                </span>
                {bi("聪明旅行者的酒店搜索", "Hotel search for smart travelers")}
              </div>
              <h1>
                {bi("花更少的钱，", "Pay less.")}
                <br />
                {bi(<>住得更<span>值得</span>。</>, <>Stay <span>better</span>.</>)}
              </h1>
              <p>
                {bi(
                  "不只看一个最低价。我们比较真实总价、住客口碑、位置与退订条件，帮你找到当下更值得下单的那一家。",
                  "We compare total price, guest reviews, distance and cancellation terms, so you can find the stay that is actually worth booking.",
                )}
              </p>
              <div className="hero-benefits">
                <span>
                  <Check size={14} />
                  {bi("四平台比价", "4-platform compare")}
                </span>
                <span>
                  <Check size={14} />
                  {bi("真总价优先", "Total price first")}
                </span>
                <span>
                  <Check size={14} />
                  {bi("具体地点推荐", "Landmark-based picks")}
                </span>
              </div>
            </div>

            {heroPick && (
              <div className="hero-visual">
                <div className="hero-photo">
                  <img src="/images/hero.jpg" alt={bi("度假酒店泳池与山景", "Resort pool and mountain view")} />
                  <div className="hero-photo__shade" />
                  <div className="hero-place">
                    <MapPin size={14} />
                    {placeName(primaryPlace, lang)}
                  </div>
                  <div className="hero-save-tag">
                    <TrendingDown size={15} />
                    {bi("本次最多可省", "Save up to")}
                    <strong>
                      ¥{Math.max(
                        ...allHotels.map((hotel) => hotel.highestPrice - hotel.bestPrice),
                      )}
                    </strong>
                  </div>
                </div>

                <div className="hero-pick-card">
                  <img src={heroPick.image} alt="" />
                  <div className="hero-pick-copy">
                    <span>{bi("智能推荐", "SMART PICK")}</span>
                    <strong>{hotelName(heroPick)}</strong>
                    <small>
                      <Star size={11} fill="currentColor" />
                      {heroPick.rating} · {provider(heroPick.bestPlatform)}
                    </small>
                  </div>
                  <div className="hero-pick-score">
                    <strong>{heroPick.recommendationScore}</strong>
                    <span>{bi("值得指数", "VALUE")}</span>
                  </div>
                </div>

                <div className="floating-price-card">
                  <span>{bi("最低每晚", "BEST / NIGHT")}</span>
                  <strong>
                    <i>¥</i>
                    {heroPick.bestPrice}
                  </strong>
                  <small>
                    {provider(heroPick.bestPlatform)} · {bi("含税估算", "tax est.")}
                  </small>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="container search-overlap">
          <SearchPanel
            draft={draft}
            setDraft={setDraft}
            onSearch={handleSearch}
            onPreferenceChange={handlePreferenceChange}
            error={formError}
          />
        </div>

        <section className="trust-strip">
          <div className="container trust-strip__inner">
            <div>
              <span className="trust-icon">
                <ShieldCheck size={18} />
              </span>
              <p>
                <strong>{bi("到手价思维", "Total price, not teaser price")}</strong>
                <small>{bi("把税费与平台差异算进来", "Taxes and platform differences included")}</small>
              </p>
            </div>
            <div>
              <span className="trust-icon">
                <BadgeCheck size={18} />
              </span>
              <p>
                <strong>{bi("不只最低价", "More than the lowest price")}</strong>
                <small>{bi("口碑、位置与权益一起衡量", "Reviews, location and perks together")}</small>
              </p>
            </div>
            <div>
              <span className="trust-icon">
                <Tag size={18} />
              </span>
              <p>
                <strong>{bi("地点可精确选择", "Search by exact place")}</strong>
                <small>{bi("支持校区、公司、车站与商圈", "Campus, office, station or district")}</small>
              </p>
            </div>
          </div>
        </section>

        <section className="results-section" id="results">
          <div className="container">
            <div className="results-heading">
              <div>
                {applied.mode === "between" ? (
                  <div className="meetup-route-summary">
                    <span className="route-place">
                      <i>A</i>
                      {placeName(primaryPlace, lang)}
                    </span>
                    <span className="route-connector">
                      <span />
                      <Heart size={13} fill="currentColor" />
                      <span />
                    </span>
                    <span className="route-place">
                      <i>B</i>
                      {placeName(secondaryPlace, lang)}
                    </span>
                    {pairDistance !== null && (
                      <em>
                        {bi("两地约", "About")} {formatDistance(pairDistance, lang)}
                      </em>
                    )}
                  </div>
                ) : (
                  <div className="results-location">
                    <MapPin size={13} />
                    <span>{placeName(primaryPlace, lang)}</span>
                    <span className="location-dot">·</span>
                    {formatDate(applied.checkIn, lang)} — {formatDate(applied.checkOut, lang)}
                    <span className="location-dot">·</span>
                    {applied.guests} {bi("位住客", "guests")}
                  </div>
                )}
                <h2>
                  {applied.mode === "between" ? (
                    bi("适合约会中途落脚的好价酒店", "Great-value hotels between both of you")
                  ) : lang === "en" ? (
                    <>
                      {visibleHotels.length} hotels worth booking nearby
                    </>
                  ) : (
                    <>
                      为你在目的地附近找到 <em>{visibleHotels.length}</em> 家值得住的酒店
                    </>
                  )}
                </h2>
                <p>
                  {lang === "en"
                    ? `Ranked by ${activePreference.labelEn}`
                    : `已按「${activePreference.label}」排序`}
                  <span className="heading-separator" />
                  {bi(
                    "先看真实总价，再看位置与口碑",
                    "Lowest total price first, then location and reputation",
                  )}
                </p>
                {primaryPlace.isApproximate && (
                  <div className="location-approx-note">
                    <MapPin size={13} />
                    {bi(
                      "该地址未命中离线地点库，距离暂按城市中心估算。建议从搜索下拉框选择具体地标。",
                      "This address is not in the offline place index. Distances currently use the city center; choose a suggested landmark for better results.",
                    )}
                  </div>
                )}
              </div>
              <div className="results-actions">
                <button
                  className="mobile-filter-trigger"
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <Filter size={16} />
                  {bi("筛选", "Filters")}
                </button>
                <label className="sort-select">
                  <span>{bi("排序", "Sort")}</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {lang === "en" ? option.labelEn : option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>
            </div>

            <div className="results-layout">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                priceBounds={{ min: 200, max: 1600 }}
                resultCount={visibleHotels.length}
                onReset={() => setFilters(initialFilters)}
                isOpen={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
              />

              <div className="hotel-list">
                <div className="list-summary">
                  <span>
                    <Sparkles size={14} />
                    {bi("按你的偏好实时重排", "Re-ranked for your priorities")}
                  </span>
                  <span>{bi("价格含税费估算", "Estimated total with taxes")}</span>
                </div>
                {visibleHotels.length ? (
                  visibleHotels.map((hotel, index) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      index={index}
                      nights={nights}
                      rooms={applied.rooms}
                      isFavorite={favoriteIds.has(hotel.id)}
                      isCompared={compareHotels.some((item) => item.id === hotel.id)}
                      compareDisabled={compareHotels.length >= 3}
                      searchMode={applied.mode}
                      focusPlace={focusPlace}
                      onFavorite={handleFavorite}
                      onCompare={handleCompare}
                      onOpen={setDetailHotel}
                      onProviderClick={handleProviderClick}
                    />
                  ))
                ) : (
                  <div className="empty-results">
                    <span>
                      <Search size={25} />
                    </span>
                    <h3>{bi("当前条件下没有合适的酒店", "No hotels match these filters")}</h3>
                    <p>
                      {bi(
                        "试试放宽预算、取消「仅看收藏」，或降低评分要求。",
                        "Raise the budget, turn off favorites-only, or lower the rating requirement.",
                      )}
                    </p>
                    <button type="button" onClick={() => setFilters(initialFilters)}>
                      {bi("重置筛选条件", "Reset filters")}
                    </button>
                  </div>
                )}
              </div>

              <PriceInsights
                hotels={visibleHotels}
                nights={nights}
                rooms={applied.rooms}
                searchMode={applied.mode}
                focusPlace={focusPlace}
                onOpenHotel={setDetailHotel}
                onLiveSearch={() =>
                  handleProviderClick(
                    { name: "Booking", url: searchUrl },
                    { city: resolvedCity, ...applied },
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container how-it-works__inner">
            <div className="how-copy">
              <span className="eyebrow">THE RIGHT WAY TO BOOK</span>
              <h2>
                {bi(
                  "低价是一道计算题，不是一场碰运气。",
                  "A low price is a calculation, not a lucky guess.",
                )}
              </h2>
              <p>
                {bi(
                  "“住得值”把房价之外的因素也纳入选择：位置是否省时间、早餐是否实用、取消政策是否留有余地，以及不同平台的最终到手价。",
                  "StayWise also weighs what the room rate leaves out: time saved by the location, useful breakfasts, flexible cancellation, and the final price on each platform.",
                )}
              </p>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {bi("回到我的推荐", "Back to my picks")}
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="method-grid">
              <article>
                <span>01</span>
                <TrendingDown size={20} />
                <h3>{bi("先比总价", "Compare totals")}</h3>
                <p>
                  {bi(
                    "同日期、同房型、同权益，把税费和服务费一起比较。",
                    "Match dates, room types and perks, then include taxes and service fees.",
                  )}
                </p>
              </article>
              <article>
                <span>02</span>
                <Star size={20} />
                <h3>{bi("再比体验", "Compare the stay")}</h3>
                <p>
                  {bi(
                    "不只看星级，更看近期真实住客口碑与具体位置。",
                    "Look beyond stars to recent guest feedback and the exact location.",
                  )}
                </p>
              </article>
              <article>
                <span>03</span>
                <Bell size={20} />
                <h3>{bi("最后看时机", "Watch the timing")}</h3>
                <p>
                  {bi(
                    "用价格趋势判断该立即下单，还是先设提醒继续观察。",
                    "Use the trend to decide whether to book now or track a better price.",
                  )}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="city-inspiration">
          <div className="container">
            <div className="inspiration-heading">
              <div>
                <span className="eyebrow">NEXT ESCAPE</span>
                <h2>{bi("下一站，住得更好一点", "Next stop, a better stay")}</h2>
              </div>
              <Compass size={28} />
            </div>
            <div className="city-chips">
              {supportedCities.map((cityKey, index) => (
                <button
                  key={cityKey}
                  type="button"
                  onClick={() => {
                    const nextDraft = {
                      ...draft,
                      destination: cityMeta[cityKey].zh,
                      cityHint: cityKey,
                      mode: "single",
                    };
                    setDraft(nextDraft);
                    setApplied(nextDraft);
                    document
                      .getElementById("results")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <span>{`0${index + 1}`}</span>
                  <strong>{city(cityKey)}</strong>
                  <small>{index % 2 === 0 ? bi("城市灵感", "City break") : bi("周末短住", "Weekend stay")}</small>
                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">
              <Building2 size={18} />
            </span>
            <div>
              <strong>{bi("住得值", "StayWise")}</strong>
              <p>
                {bi(
                  "让每一笔住宿预算，都花在真正重要的地方。",
                  "Make every hotel budget count where it matters.",
                )}
              </p>
            </div>
          </div>
          <div className="footer-meta">
            <span>{bi("中英双语开源项目", "Bilingual open-source project")}</span>
            <span>{bi("模拟报价不构成订房承诺", "Demo prices are not booking promises")}</span>
          </div>
        </div>
      </footer>

      <CompareDock
        hotels={compareHotels}
        onOpen={() => setCompareOpen(true)}
        onClear={() => setCompareHotels([])}
        onRemove={handleRemoveCompare}
      />

      {detailHotel && (
        <HotelDetailModal
          hotel={detailHotel}
          checkIn={applied.checkIn}
          checkOut={applied.checkOut}
          nights={nights}
          rooms={applied.rooms}
          isFavorite={favoriteIds.has(detailHotel.id)}
          onFavorite={handleFavorite}
          onClose={() => setDetailHotel(null)}
          onAlert={(hotel) => {
            setDetailHotel(null);
            setAlertHotel(hotel);
          }}
          onProviderClick={handleProviderClick}
        />
      )}

      {compareOpen && (
        <CompareModal
          hotels={compareHotels}
          checkIn={applied.checkIn}
          checkOut={applied.checkOut}
          nights={nights}
          rooms={applied.rooms}
          onClose={() => setCompareOpen(false)}
          onRemove={(hotel) => {
            handleRemoveCompare(hotel);
            if (compareHotels.length <= 2) setCompareOpen(false);
          }}
          onOpenHotel={(hotel) => {
            setCompareOpen(false);
            setDetailHotel(hotel);
          }}
        />
      )}

      {alertHotel && (
        <AlertModal
          hotel={alertHotel}
          onClose={() => setAlertHotel(null)}
          onSave={handleSaveAlert}
        />
      )}

      {savedDrawer && (
        <SavedDrawer
          initialTab={savedDrawer}
          alerts={alerts}
          favorites={favorites}
          onClose={() => setSavedDrawer(null)}
          onDeleteAlert={(id) =>
            setAlerts((current) => current.filter((alert) => alert.id !== id))
          }
          onRemoveFavorite={(id) =>
            setFavorites((current) => current.filter((hotel) => hotel.id !== id))
          }
          onOpenHotel={(hotel) => {
            setSavedDrawer(null);
            setDetailHotel(hotel);
          }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
