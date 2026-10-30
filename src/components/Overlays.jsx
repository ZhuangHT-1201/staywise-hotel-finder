import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Heart,
  MapPin,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import PriceChart from "./PriceChart";
import {
  calculateNights,
  formatDate,
  getPriceTrend,
  getStayTotal,
} from "../utils/hotelLogic";
import { useLanguage } from "../i18n";

function ModalShell({ children, onClose, className = "", label = "Dialog" }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={19} />
        </button>
        {children}
      </section>
    </div>
  );
}

export function HotelDetailModal({
  hotel,
  checkIn,
  checkOut,
  nights,
  rooms,
  isFavorite,
  onFavorite,
  onClose,
  onAlert,
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
    hotelRoom,
    provider,
  } = useLanguage();
  const [offerTab, setOfferTab] = useState("all");
  const trend = getPriceTrend(hotel);
  const sortedOffers = [...hotel.offers].sort((a, b) => a.total - b.total);
  const visibleOffers =
    offerTab === "all"
      ? sortedOffers
      : sortedOffers.filter((offer) =>
          offerTab === "perks"
            ? offer.breakfast || offer.freeCancel
            : offer.freeCancel,
        );
  const bestOffer = sortedOffers[0];
  const total = getStayTotal(bestOffer.total, nights, rooms);

  return (
    <ModalShell
      className="hotel-modal"
      label={bi(`${hotelName(hotel)}详情`, `${hotelName(hotel)} details`)}
      onClose={onClose}
    >
      <div className="hotel-modal__hero">
        <img
          src={hotel.image}
          alt={bi(`${hotelName(hotel)}客房空间示意`, `Room space at ${hotelName(hotel)}`)}
        />
        <div className="hotel-modal__hero-shade" />
        <div className="detail-hero-copy">
          <div className="detail-kicker">
            <span>{"★".repeat(hotel.stars)}</span>
            {hotelStyle(hotel)} · {city(hotel.city)}
          </div>
          <h2>{hotelName(hotel)}</h2>
          <div className="detail-hero-meta">
            <span>
              <MapPin size={14} />
              {hotelArea(hotel)}
            </span>
            <span>
              <Star size={14} fill="currentColor" />
              {hotel.rating} · {number(hotel.reviewCount)} {bi("条评价", "reviews")}
            </span>
          </div>
        </div>
        <button
          className={`detail-favorite ${isFavorite ? "active" : ""}`}
          type="button"
          onClick={() => onFavorite(hotel)}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? bi("已收藏", "Saved") : bi("收藏", "Save")}
        </button>
      </div>

      <div className="hotel-modal__content">
        <div className="detail-primary">
          <div className="detail-reason-card">
            <div className="reason-score">
              <span>
                <Sparkles size={16} />
                {bi("值得指数", "VALUE SCORE")}
              </span>
              <strong>{hotel.recommendationScore}</strong>
              <small>/ 100</small>
            </div>
            <div className="reason-copy">
              <h3>{bi("为什么推荐它", "Why this hotel")}</h3>
              <p>
                {bi(
                  `口碑 ${hotel.rating} 分，位置与硬件均衡；当前最低报价比本次最高平台报价低`,
                  `Rated ${hotel.rating} with a strong location and facilities. Its best offer is`,
                )}
                <strong> ¥{hotel.highestPrice - hotel.bestPrice}</strong>
                {bi("，适合优先核实。", " below the highest platform quote.")}
              </p>
              <div className="reason-tags">
                {hotel.breakfast && (
                  <span>
                    <Coffee size={13} />
                    {bi("可选含早", "Breakfast available")}
                  </span>
                )}
                {hotel.freeCancel && (
                  <span>
                    <ShieldCheck size={13} />
                    {bi("可免费取消", "Free cancellation")}
                  </span>
                )}
                <span>
                  <MapPin size={13} />
                  {hotelNearby(hotel)}
                </span>
              </div>
            </div>
          </div>

          <section className="detail-section">
            <div className="detail-section__heading">
              <div>
                <span className="eyebrow">LIVE PRICE CHECK</span>
                <h3>{bi("平台报价", "Platform offers")}</h3>
              </div>
              <div className="offer-tabs">
                <button
                  className={offerTab === "all" ? "active" : ""}
                  type="button"
                  onClick={() => setOfferTab("all")}
                >
                  {bi("全部", "All")}
                </button>
                <button
                  className={offerTab === "perks" ? "active" : ""}
                  type="button"
                  onClick={() => setOfferTab("perks")}
                >
                  {bi("含权益", "With perks")}
                </button>
                <button
                  className={offerTab === "cancel" ? "active" : ""}
                  type="button"
                  onClick={() => setOfferTab("cancel")}
                >
                  {bi("可取消", "Cancellable")}
                </button>
              </div>
            </div>
            <div className="offer-list">
              {visibleOffers.map((offer, index) => (
                <div
                  className={`offer-row ${index === 0 && offerTab === "all" ? "offer-row--best" : ""}`}
                  key={offer.name}
                >
                  <span
                    className="platform-logo"
                    style={{ background: offer.color, color: offer.text }}
                  >
                    {offer.short}
                  </span>
                  <div className="offer-provider">
                    <strong>{provider(offer.name)}</strong>
                    <span>
                      {offer.freeCancel ? bi("免费取消", "Free cancellation") : bi("限时取消", "Limited cancellation")}
                      {" · "}
                      {offer.breakfast ? bi("含早餐", "Breakfast") : bi("不含早", "Room only")}
                    </span>
                  </div>
                  <div className="offer-tags">
                    {offer.member && <span>{bi("会员价", "Member")}</span>}
                    {index === 0 && offerTab === "all" && (
                      <span className="best-tag">{bi("最低价", "Lowest")}</span>
                    )}
                  </div>
                  <div className="offer-price">
                    <strong>¥{offer.total}</strong>
                    <span>
                      /{bi("晚", "night")}
                      {offer.tax > 0
                        ? ` · ${bi("含税费", "tax")} ¥${offer.tax}`
                        : ` · ${bi("含税", "tax included")}`}
                    </span>
                  </div>
                  <button type="button" onClick={() => onProviderClick(offer, hotel)}>
                    {bi("核价", "Check")}
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="detail-disclaimer">
              {bi(
                "当前为可交互演示报价，不构成实时订房承诺。点击核价会前往平台，请按酒店名与日期复核。",
                "These are interactive demo offers, not live booking promises. Verify the hotel and dates on the platform.",
              )}
            </p>
          </section>

          <section className="detail-section">
            <div className="detail-section__heading">
              <div>
                <span className="eyebrow">PRICE FORECAST</span>
                <h3>{bi("价格走势", "Price trend")}</h3>
              </div>
              <span className="trend-badge">{bi("当前处于低位", "Near a low")}</span>
            </div>
            <PriceChart
              values={trend}
              labels={[bi("14 天前", "14 days ago"), bi("今天", "Today")]}
            />
            <div className="trend-advice">
              <BellRing size={16} />
              {bi(
                "现在预订的模拟价格低于近 14 天均价。若还能免费取消，可以先锁房再持续观察。",
                "The demo price is below the 14-day average. If free cancellation is available, book now and keep watching.",
              )}
            </div>
          </section>
        </div>

        <aside className="detail-booking">
          <div className="detail-date">
            <CalendarDays size={16} />
            <span>
              {formatDate(checkIn, lang)} — {formatDate(checkOut, lang)}
              <small>
                {calculateNights(checkIn, checkOut)}{" "}
                {bi("晚", calculateNights(checkIn, checkOut) === 1 ? "night" : "nights")} ·{" "}
                {rooms} {bi("间房", rooms === 1 ? "room" : "rooms")}
              </small>
            </span>
          </div>
          <div className="detail-room">
            <span>{hotelRoom(hotel)}</span>
            <small>{bi("2 位住客 · 1 张特大床", "2 guests · 1 king bed")}</small>
          </div>
          <div className="detail-saving-callout">
            <span>{bi("跨平台价差", "Platform price gap")}</span>
            <strong>¥{hotel.highestPrice - hotel.bestPrice}</strong>
            <small>{bi("同日期、同房型估算", "Same dates and room type")}</small>
          </div>
          <div className="detail-total">
            <span>{bi("最优平台总价", "Best platform total")}</span>
            <div>
              <strong>¥{number(total)}</strong>
              <small>
                ¥{bestOffer.total}/{bi("晚", "night")} × {nights} × {rooms}
              </small>
            </div>
          </div>
          <button
            className="detail-book-button"
            type="button"
            onClick={() => onProviderClick(bestOffer, hotel)}
          >
            {bi(
              `去 ${provider(bestOffer.name)} 核对房价`,
              `Verify on ${provider(bestOffer.name)}`,
            )}
            <ArrowUpRight size={17} />
          </button>
          <button className="alert-outline-button" type="button" onClick={() => onAlert(hotel)}>
            <Bell size={16} />
            {bi("降价到这个价，提醒我", "Alert me at a better price")}
          </button>
          <p>
            {bi(
              "模拟价格含平台服务费估算，最终金额以预订页面为准。",
              "Demo prices include estimated fees. The booking page is final.",
            )}
          </p>
        </aside>
      </div>
    </ModalShell>
  );
}

export function AlertModal({ hotel, onClose, onSave }) {
  const { bi, hotelName, provider } = useLanguage();
  const suggested = Math.max(99, Math.round((hotel.bestPrice * 0.95) / 10) * 10 - 1);
  const [target, setTarget] = useState(suggested);

  return (
    <ModalShell
      className="alert-modal"
      label={bi("设置价格提醒", "Set price alert")}
      onClose={onClose}
    >
      <div className="alert-modal__icon">
        <BellRing size={24} />
      </div>
      <span className="eyebrow">PRICE ALERT</span>
      <h2>{bi("等到好价，再决定", "Wait for the right price")}</h2>
      <p className="alert-intro">
        {bi("为", "Set a target for")} <strong>{hotelName(hotel)}</strong>{" "}
        {bi(
          "设置目标价。本项目会把提醒保存在当前浏览器中。",
          "This demo stores the alert in your current browser.",
        )}
      </p>

      <div className="alert-hotel-line">
        <img src={hotel.image} alt="" />
        <div>
          <strong>{hotelName(hotel)}</strong>
          <span>
            {bi("当前最低", "Current low")} ¥{hotel.bestPrice}/{bi("晚", "night")} ·{" "}
            {provider(hotel.bestPlatform)}
          </span>
        </div>
      </div>

      <label className="target-price-field">
        <span>{bi("我的目标价", "My target price")}</span>
        <div>
          <i>¥</i>
          <input
            type="number"
            min={60}
            step={10}
            value={target}
            onChange={(event) => setTarget(Number(event.target.value))}
          />
          <small>/ {bi("晚", "night")}</small>
        </div>
      </label>

      <div className="alert-quick-picks">
        {[0.95, 0.9, 0.85].map((ratio) => {
          const price = Math.round((hotel.bestPrice * ratio) / 10) * 10 - 1;
          return (
            <button
              key={ratio}
              className={target === price ? "active" : ""}
              type="button"
              onClick={() => setTarget(price)}
            >
              −{Math.round((1 - ratio) * 100)}% · ¥{price}
            </button>
          );
        })}
      </div>

      <div className="alert-benefits">
        <span>
          <Check size={14} />
          {bi("同时记录日期与房型", "Saves dates and room type")}
        </span>
        <span>
          <Check size={14} />
          {bi("随时修改或删除", "Edit or delete anytime")}
        </span>
      </div>

      <button
        className="alert-save-button"
        type="button"
        disabled={!target || target <= 0}
        onClick={() => onSave(target)}
      >
        <Bell size={17} />
        {bi("保存价格提醒", "Save price alert")}
      </button>
      <p className="alert-tech-note">
        {bi(
          "这是前端演示版：提醒会持久化到 localStorage，但不会在后台自动抓取或发送通知。",
          "Demo notice: alerts persist in localStorage, but do not scrape prices or send background notifications.",
        )}
      </p>
    </ModalShell>
  );
}

export function CompareModal({
  hotels,
  checkIn,
  checkOut,
  nights,
  rooms,
  onClose,
  onRemove,
  onOpenHotel,
}) {
  const { lang, bi, number, hotelName, hotelArea, provider } = useLanguage();
  return (
    <ModalShell
      className="compare-modal"
      label={bi("酒店对比", "Hotel comparison")}
      onClose={onClose}
    >
      <div className="compare-heading">
        <div>
          <span className="eyebrow">COMPARE & DECIDE</span>
          <h2>{bi("把关键差异放在一起看", "Compare what actually matters")}</h2>
          <p>
            {formatDate(checkIn, lang)} — {formatDate(checkOut, lang)} · {nights}{" "}
            {bi("晚", nights === 1 ? "night" : "nights")} · {rooms}{" "}
            {bi("间", rooms === 1 ? "room" : "rooms")}
          </p>
        </div>
        <Scale size={28} />
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>{bi("比较项", "Criteria")}</th>
              {hotels.map((hotel) => (
                <th key={hotel.id}>
                  <div className="compare-hotel-head">
                    <img src={hotel.image} alt="" />
                    <button
                      type="button"
                      className="compare-remove"
                      onClick={() => onRemove(hotel)}
                      aria-label={bi(`移除${hotelName(hotel)}`, `Remove ${hotelName(hotel)}`)}
                    >
                      <X size={14} />
                    </button>
                    <strong>{hotelName(hotel)}</strong>
                    <span>{hotelArea(hotel)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{bi("值得指数", "Value score")}</th>
              {hotels.map((hotel, index) => (
                <td key={hotel.id}>
                  <span className={`compare-score ${index === 0 ? "best" : ""}`}>
                    {hotel.recommendationScore}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <th>{bi("住客评分", "Guest rating")}</th>
              {hotels.map((hotel) => (
                <td key={hotel.id}>
                  <strong>{hotel.rating}</strong>
                  <small>
                    {number(hotel.reviewCount)} {bi("条", "reviews")}
                  </small>
                </td>
              ))}
            </tr>
            <tr>
              <th>{bi("每晚最低价", "Lowest per night")}</th>
              {hotels.map((hotel) => (
                <td key={hotel.id}>
                  <strong className="compare-price">¥{hotel.bestPrice}</strong>
                  <small>{provider(hotel.bestPlatform)}</small>
                </td>
              ))}
            </tr>
            <tr>
              <th>{bi("全程总价", "Stay total")}</th>
              {hotels.map((hotel) => (
                <td key={hotel.id}>
                  <strong>¥{number(getStayTotal(hotel.bestPrice, nights, rooms))}</strong>
                </td>
              ))}
            </tr>
            <tr>
              <th>{bi("位置", "Location")}</th>
              {hotels.map((hotel) => (
                <td key={hotel.id}>
                  {hotelArea(hotel)}
                  <small>{bi("距中点", "From midpoint")} {((hotel.focusDistanceKm ?? hotel.distance / 1000)).toFixed(1)} km</small>
                </td>
              ))}
            </tr>
            <tr>
              <th>{bi("早餐", "Breakfast")}</th>
              {hotels.map((hotel) => (
                <td key={hotel.id}>{hotel.breakfast ? bi("可选含早", "Available") : bi("不含早", "No")}</td>
              ))}
            </tr>
            <tr>
              <th>{bi("免费取消", "Free cancellation")}</th>
              {hotels.map((hotel) => (
                <td key={hotel.id}>{hotel.freeCancel ? bi("支持", "Yes") : bi("不支持", "No")}</td>
              ))}
            </tr>
            <tr>
              <th>{bi("选择", "Select")}</th>
              {hotels.map((hotel) => (
                <td key={hotel.id}>
                  <button type="button" onClick={() => onOpenHotel(hotel)}>
                    {bi("查看详情", "View details")}
                    <ChevronRight size={14} />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </ModalShell>
  );
}

export function SavedDrawer({
  initialTab,
  alerts,
  favorites,
  onClose,
  onDeleteAlert,
  onRemoveFavorite,
  onOpenHotel,
}) {
  const { bi, hotelName, hotelArea, city } = useLanguage();
  const [tab, setTab] = useState(initialTab);
  useEffect(() => setTab(initialTab), [initialTab]);

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="saved-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={bi("我的提醒与收藏", "My alerts and favorites")}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="saved-drawer__head">
          <div>
            <span className="eyebrow">YOUR SHORTLIST</span>
            <h2>{bi("我的住店清单", "My shortlist")}</h2>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="drawer-tabs">
          <button
            className={tab === "alerts" ? "active" : ""}
            type="button"
            onClick={() => setTab("alerts")}
          >
            <Bell size={16} />
            {bi("价格提醒", "Price alerts")}
            <span>{alerts.length}</span>
          </button>
          <button
            className={tab === "favorites" ? "active" : ""}
            type="button"
            onClick={() => setTab("favorites")}
          >
            <Heart size={16} />
            {bi("我的收藏", "Favorites")}
            <span>{favorites.length}</span>
          </button>
        </div>

        <div className="saved-drawer__body">
          {tab === "alerts" &&
            (alerts.length ? (
              alerts.map((alert) => (
                <div className="saved-item" key={alert.id}>
                  <img src={alert.hotel.image} alt="" />
                  <div className="saved-item__copy">
                    <strong>{hotelName(alert.hotel)}</strong>
                    <span>
                      {bi("目标", "Target")} <b>¥{alert.target}</b> / {bi("晚", "night")}
                    </span>
                    <small>
                      {bi("当前", "Now")} ¥{alert.hotel.bestPrice} · {alert.checkIn}{" "}
                      {bi("入住", "check-in")}
                    </small>
                  </div>
                  <button
                    className="saved-remove"
                    type="button"
                    aria-label={bi("删除提醒", "Delete alert")}
                    onClick={() => onDeleteAlert(alert.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            ) : (
              <EmptySaved
                icon={Bell}
                title={bi("还没有价格提醒", "No price alerts yet")}
                copy={bi(
                  "打开任意酒店详情，设置你愿意入手的目标价。",
                  "Open any hotel and set the price you are willing to pay.",
                )}
              />
            ))}

          {tab === "favorites" &&
            (favorites.length ? (
              favorites.map((hotel) => (
                <div className="saved-item" key={hotel.id}>
                  <img src={hotel.image} alt="" />
                  <div className="saved-item__copy">
                    <strong>{hotelName(hotel)}</strong>
                    <span>
                      <Star size={12} fill="currentColor" />
                      {hotel.rating} · {city(hotel.city)} {hotelArea(hotel)}
                    </span>
                    <small>
                      {bi("演示最低", "Demo low")} ¥{hotel.bestPrice} / {bi("晚", "night")}
                    </small>
                  </div>
                  <div className="saved-item__actions">
                    <button type="button" onClick={() => onOpenHotel(hotel)}>
                      {bi("查看", "View")}
                    </button>
                    <button
                      className="saved-remove"
                      type="button"
                      aria-label={bi("取消收藏", "Remove favorite")}
                      onClick={() => onRemoveFavorite(hotel.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptySaved
                icon={Heart}
                title={bi("心愿单还是空的", "Your shortlist is empty")}
                copy={bi(
                  "点酒店卡片右上角的心形，把喜欢的选择留在这里。",
                  "Tap the heart on a hotel card to keep it here.",
                )}
              />
            ))}
        </div>

        <div className="saved-drawer__foot">
          <ShieldCheck size={14} />
          {bi("所有内容仅保存在当前浏览器", "Saved only in this browser")}
        </div>
      </aside>
    </div>
  );
}

function EmptySaved({ icon: Icon, title, copy }) {
  return (
    <div className="empty-saved">
      <span>
        <Icon size={24} />
      </span>
      <strong>{title}</strong>
      <p>{copy}</p>
    </div>
  );
}

export function CompareDock({ hotels, onOpen, onClear, onRemove }) {
  const { bi, hotelName } = useLanguage();
  if (!hotels.length) return null;
  return (
    <div className="compare-dock">
      <div className="compare-dock__label">
        <Scale size={18} />
        <span>
          {bi("酒店对比", "Compare")}
          <small>{hotels.length}/3</small>
        </span>
      </div>
      <div className="compare-dock__items">
        {hotels.map((hotel) => (
          <div className="dock-item" key={hotel.id}>
            <img src={hotel.image} alt="" />
            <span>{hotelName(hotel)}</span>
            <button
              type="button"
              onClick={() => onRemove(hotel)}
              aria-label={bi("移除", "Remove")}
            >
              <X size={13} />
            </button>
          </div>
        ))}
        {hotels.length < 3 && (
          <span className="dock-hint">
            {bi(`还可添加 ${3 - hotels.length} 家`, `${3 - hotels.length} more available`)}
          </span>
        )}
      </div>
      <button className="dock-clear" type="button" onClick={onClear}>
        {bi("清空", "Clear")}
      </button>
      <button className="dock-compare" type="button" onClick={onOpen}>
        {bi("开始对比", "Compare")}
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast" role="status">
      <span>
        <Check size={14} />
      </span>
      {message}
    </div>
  );
}
