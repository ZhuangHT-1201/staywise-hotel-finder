import {
  ArrowUpRight,
  Check,
  Coffee,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Wifi,
} from "lucide-react";
import { getStayTotal } from "../utils/hotelLogic";
import { formatDistance, placeName } from "../data/locations";
import { useLanguage } from "../i18n";

const amenityIcons = {
  "免费Wi-Fi": Wifi,
  早餐: Coffee,
};

export default function HotelCard({
  hotel,
  index,
  nights,
  rooms,
  isFavorite,
  isCompared,
  compareDisabled,
  searchMode,
  focusPlace,
  onFavorite,
  onCompare,
  onOpen,
  onProviderClick,
}) {
  const {
    lang,
    bi,
    number,
    city,
    hotelName,
    hotelArea,
    hotelStyle,
    hotelNearby,
    hotelReview,
    amenity,
    provider,
    salesHint,
  } = useLanguage();
  const total = getStayTotal(hotel.bestPrice, nights, rooms);
  const bestOffer = hotel.offers.find((offer) => offer.total === hotel.bestPrice);
  const distanceLabel =
    searchMode === "between"
      ? bi("距约会中点", "From midpoint")
      : bi(`距 ${placeName(focusPlace, lang)}`, `From ${placeName(focusPlace, lang)}`);

  return (
    <article className={`hotel-card ${index === 0 ? "hotel-card--top" : ""}`}>
      <div className="hotel-card__media">
        <img
          src={hotel.image}
          alt={bi(`${hotelName(hotel)}客房空间示意`, `Room space at ${hotelName(hotel)}`)}
        />
        <div className="image-shade" />
        {index === 0 && (
          <span className="award-ribbon">{bi("综合首选", "Top pick")}</span>
        )}
        <button
          className={`heart-button ${isFavorite ? "is-favorite" : ""}`}
          type="button"
          aria-label={isFavorite ? bi("取消收藏", "Remove favorite") : bi("收藏酒店", "Save hotel")}
          onClick={() => onFavorite(hotel)}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <div className="score-badge">
          <strong>{hotel.recommendationScore}</strong>
          <span>{bi("值得指数", "VALUE SCORE")}</span>
        </div>
      </div>

      <div className="hotel-card__body">
        <div className="hotel-card__title-row">
          <div>
            <div className="hotel-kicker">
              <span>{"★".repeat(hotel.stars)}</span>
              {hotelStyle(hotel)}
            </div>
            <h3>
              <button type="button" onClick={() => onOpen(hotel)}>
                {hotelName(hotel)}
              </button>
            </h3>
          </div>
          <div className="review-score">
            <strong>{hotel.rating.toFixed(1)}</strong>
            <span>
              {number(hotel.reviewCount)} {bi("条评价", "reviews")}
            </span>
          </div>
        </div>

        <div className="hotel-location">
          <MapPin size={15} />
          <span>
            {city(hotel.city)} · {hotelArea(hotel)}
          </span>
          <i />
          <span>
            {distanceLabel} {formatDistance(hotel.locationDistanceKm ?? hotel.distance / 1000, lang)}
          </span>
        </div>

        <p className="hotel-nearby">{hotelNearby(hotel)}</p>

        <div className="hotel-amenities">
          {hotel.breakfast && (
            <span>
              <Coffee size={14} />
              {bi("含早餐", "Breakfast available")}
            </span>
          )}
          {hotel.freeCancel && (
            <span>
              <ShieldCheck size={14} />
              {bi("免费取消", "Free cancellation")}
            </span>
          )}
          {hotel.amenities.slice(0, 2).map((item) => {
            const Icon = amenityIcons[item] ?? Check;
            return (
              <span key={item}>
                <Icon size={14} />
                {amenity(item)}
              </span>
            );
          })}
        </div>

        <div className="hotel-review">
          <Star size={14} fill="currentColor" />
          <span>“{hotelReview(hotel)}”</span>
        </div>

        <div className="hotel-card__footer">
          <button
            className={`compare-button ${isCompared ? "active" : ""}`}
            type="button"
            onClick={() => onCompare(hotel)}
            disabled={compareDisabled && !isCompared}
          >
            <span className="compare-check">{isCompared && <Check size={12} />}</span>
            {isCompared ? bi("已加入对比", "Added to compare") : bi("加入对比", "Compare")}
          </button>
          <button className="detail-link" type="button" onClick={() => onOpen(hotel)}>
            {bi("查看推荐理由", "Why this hotel")}
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>

      <aside className="hotel-card__price">
        <span className="price-label">{salesHint(hotel.salesHint)}</span>
        <div className="price-main">
          <span className="currency">¥</span>
          <strong>{hotel.bestPrice}</strong>
          <span className="per-night">/ {bi("晚", "night")}</span>
        </div>
        <div className="price-saving">
          <span>
            {bi("跨平台省", "Save")} ¥{hotel.highestPrice - hotel.bestPrice}
          </span>
          <s>¥{hotel.highestPrice}</s>
        </div>
        <div className="platform-best">
          <span>{bi("全网低价", "Best price")}</span>
          <strong>{provider(hotel.bestPlatform)}</strong>
        </div>
        <div className="stay-total">
          {nights} {lang === "en" ? (nights === 1 ? "night" : "nights") : "晚"} · {rooms}{" "}
          {lang === "en" ? (rooms === 1 ? "room" : "rooms") : "间"} {bi("共", "total")}{" "}
          <strong>¥{number(total)}</strong>
        </div>
        <button
          className="offer-button"
          type="button"
          onClick={() => onProviderClick(bestOffer, hotel)}
        >
          {bi(`去 ${provider(hotel.bestPlatform)} 查看`, `View on ${provider(hotel.bestPlatform)}`)}
          <ArrowUpRight size={16} />
        </button>
        <span className="tax-note">
          {bi("含税费估算 · 以平台实时价为准", "Tax estimate · verify live price")}
        </span>
      </aside>
    </article>
  );
}
