import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import PriceChart from "./PriceChart";
import { getPriceTrend, getStayTotal } from "../utils/hotelLogic";
import { formatDistance, placeName } from "../data/locations";
import { useLanguage } from "../i18n";

export default function PriceInsights({
  hotels,
  nights,
  rooms,
  searchMode,
  focusPlace,
  onOpenHotel,
  onLiveSearch,
}) {
  const { lang, bi, number, hotelName, hotelArea, provider } = useLanguage();
  if (!hotels.length) return null;

  const recommended = hotels[0];
  const bestDeal = [...hotels].sort((a, b) => a.bestPrice - b.bestPrice)[0];
  const trend = getPriceTrend(bestDeal);
  const current = trend.at(-1);
  const average = Math.round(trend.reduce((sum, value) => sum + value, 0) / trend.length);
  const difference = Math.round(((current - average) / average) * 100);
  const belowAverage = current <= average;
  const smartest = [...hotels].sort(
    (a, b) => b.recommendationScore - a.recommendationScore,
  )[0];
  const nearby =
    hotels.find((hotel) => hotel.id !== recommended.id && hotel.area !== recommended.area) ??
    hotels.find((hotel) => hotel.id !== recommended.id) ??
    recommended;
  const alternateDifference = nearby.bestPrice - recommended.bestPrice;
  const platformCounts = hotels.reduce((counts, hotel) => {
    counts[hotel.bestPlatform] = (counts[hotel.bestPlatform] ?? 0) + 1;
    return counts;
  }, {});
  const leadingPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <aside className="insight-rail">
      <section className="insight-card radar-card">
        <div className="insight-card__title">
          <span className="insight-icon">
            <Radar size={18} />
          </span>
          <div>
            <h3>{bi("省钱雷达", "Price radar")}</h3>
            <p>{bi("基于演示报价的 14 天趋势", "14-day demo price trend")}</p>
          </div>
        </div>

        <div className={`deal-signal ${belowAverage ? "deal-signal--good" : "deal-signal--wait"}`}>
          {belowAverage ? <TrendingDown size={17} /> : <Clock3 size={17} />}
          <div>
            <strong>{belowAverage ? bi("现在值得订", "Good time to book") : bi("建议再观察", "Worth watching")}</strong>
            <span>
              {bi("比均价", "vs. average")}{" "}
              {difference <= 0 ? bi("低", "lower by") : bi("高", "higher by")}{" "}
              {Math.abs(difference)}%
            </span>
          </div>
        </div>

        <PriceChart values={trend} compact />

        <div className="radar-stats">
          <div>
            <span>{bi("预估均价", "Avg. estimate")}</span>
            <strong>¥{average}</strong>
          </div>
          <div>
            <span>{bi("当前低价", "Current low")}</span>
            <strong>¥{current}</strong>
          </div>
        </div>

        <p className="insight-note">
          <CheckCircle2 size={14} />
          {belowAverage
            ? bi("当前处于近两周较低价格区间", "Current pricing is in a two-week low range")
            : bi("临近入住通常更难降价，可先设置提醒", "Prices may rise closer to check-in. Set an alert first.")}
        </p>
      </section>

      <section className="insight-card best-choice-card">
        <div className="insight-card__title">
          <span className="insight-icon insight-icon--warm">
            <Sparkles size={18} />
          </span>
          <div>
            <h3>{bi("本次最优解", "Best match")}</h3>
            <p>
              {searchMode === "between"
                ? bi("兼顾价格、通勤与约会氛围", "Balancing price, travel and date-night comfort")
                : bi("价格与口碑同时考虑", "Balancing price and reputation")}
            </p>
          </div>
        </div>

        <button
          className="best-choice__hotel"
          type="button"
          onClick={() => onOpenHotel(smartest)}
        >
          <img src={smartest.image} alt="" />
          <span>
            <strong>{hotelName(smartest)}</strong>
            <small>
              <MapPin size={12} />
              {hotelArea(smartest)} · ★ {smartest.rating}
            </small>
          </span>
          <ArrowRight size={16} />
        </button>

        <div className="best-choice__price">
          <div>
            <span>{bi("推荐指数", "Value score")}</span>
            <strong>{smartest.recommendationScore}</strong>
          </div>
          <i />
          <div>
            <span>{bi("全程总价", "Stay total")}</span>
            <strong>¥{number(getStayTotal(smartest.bestPrice, nights, rooms))}</strong>
          </div>
        </div>
        <button className="text-cta" type="button" onClick={() => onOpenHotel(smartest)}>
          {bi("看懂为什么推荐它", "See why it wins")}
          <ArrowUpRight size={15} />
        </button>
      </section>

      <section className="insight-card saving-card">
        <div className="insight-card__title">
          <span className="insight-icon insight-icon--lime">
            <TrendingDown size={18} />
          </span>
          <div>
            <h3>{bi("换种住法", "Another way to stay")}</h3>
            <p>{bi("两个可执行的选择", "Two practical alternatives")}</p>
          </div>
        </div>

        <div className="saving-option">
          <span className="saving-option__icon">
            <BedDouble size={17} />
          </span>
          <div>
            <strong>
              {alternateDifference <= 0
                ? bi("换个商圈住", "Stay in another district")
                : bi("加一点，住得更好", "Pay a little more, stay better")}
            </strong>
            {alternateDifference <= 0 ? (
              <span>
                {bi("考虑", "Try")} {hotelArea(nearby)} ·{" "}
                <b>¥{nearby.bestPrice}</b>
              </span>
            ) : (
              <span>
                {bi("看", "Try")} {hotelArea(nearby)} ·{" "}
                {bi("每晚多", "+")} <b>¥{alternateDifference}</b>
              </span>
            )}
          </div>
          <em className={alternateDifference > 0 ? "upsell" : ""}>
            {alternateDifference <= 0
              ? `${bi("省", "Save")} ¥${Math.abs(alternateDifference)}`
              : `+ ¥${alternateDifference}`}
          </em>
        </div>

        <div className="saving-option">
          <span className="saving-option__icon">
            {searchMode === "between" ? <Heart size={17} /> : <CalendarClock size={17} />}
          </span>
          <div>
            <strong>
              {searchMode === "between"
                ? bi("约会中间点", "Date-night midpoint")
                : bi("设置降价提醒", "Set a price alert")}
            </strong>
            <span>
              {searchMode === "between"
                ? `${placeName(focusPlace, lang)} · ${formatDistance(
                    smartest.focusDistanceKm,
                    lang,
                  )}`
                : bi("目标价低于当前报价时，重点复核", "Review when the price drops below your target")}
            </span>
          </div>
        </div>

        <div className="platform-leader">
          <span>
            <ShieldCheck size={14} />
            {bi(
              `本次 ${provider(leadingPlatform[0])} 低价次数最多`,
              `${provider(leadingPlatform[0])} has the most low prices`,
            )}
          </span>
          <strong>
            {leadingPlatform[1]}/{hotels.length}
          </strong>
        </div>

        <button className="live-search-button" type="button" onClick={onLiveSearch}>
          {bi("打开 Booking 实时核价", "Check live prices on Booking")}
          <ArrowUpRight size={15} />
        </button>
        <span className="demo-footnote">
          {bi(
            "推荐排序为演示计算；预订前请以平台实时房型、税费和取消政策为准。",
            "Ranking uses demo data. Verify live room type, taxes and cancellation terms before booking.",
          )}
        </span>
      </section>
    </aside>
  );
}
