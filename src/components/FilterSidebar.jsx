import { Coffee, Heart, RotateCcw, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import { useLanguage } from "../i18n";

export default function FilterSidebar({
  filters,
  setFilters,
  priceBounds,
  resultCount,
  onReset,
  isOpen,
  onClose,
}) {
  const { bi } = useLanguage();
  const toggle = (field) =>
    setFilters((current) => ({ ...current, [field]: !current[field] }));

  return (
    <>
      {isOpen && (
        <button
          className="sidebar-scrim"
          aria-label={bi("关闭筛选", "Close filters")}
          onClick={onClose}
        />
      )}
      <aside className={`filter-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="filter-sidebar__heading">
          <span>
            <SlidersHorizontal size={17} />
            {bi("筛选条件", "Filters")}
          </span>
          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            <RotateCcw size={14} />
            {bi("重置", "Reset")}
          </button>
        </div>

        <div className="filter-group">
          <div className="filter-title">
            <span>{bi("每晚预算", "Nightly budget")}</span>
            <strong>≤ ¥{filters.maxPrice}</strong>
          </div>
          <input
            className="range-control"
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={20}
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                maxPrice: Number(event.target.value),
              }))
            }
            style={{
              "--range-progress": `${
                ((filters.maxPrice - priceBounds.min) /
                  Math.max(1, priceBounds.max - priceBounds.min)) *
                100
              }%`,
            }}
            aria-label={bi("每晚最高预算", "Maximum nightly budget")}
          />
          <div className="range-labels">
            <span>¥{priceBounds.min}</span>
            <span>¥{priceBounds.max}</span>
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-title">
            <span>{bi("住客评分", "Guest rating")}</span>
          </div>
          <div className="rating-filter-grid">
            {[
              { value: 0, label: bi("不限", "Any") },
              { value: 4.5, label: "4.5+" },
              { value: 4.7, label: "4.7+" },
              { value: 4.8, label: "4.8+" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={filters.minRating === option.value ? "active" : ""}
                onClick={() =>
                  setFilters((current) => ({ ...current, minRating: option.value }))
                }
              >
                {option.value > 0 && <Star size={12} fill="currentColor" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-title">
            <span>{bi("入住保障", "Stay protection")}</span>
          </div>
          <button
            className={`toggle-row ${filters.breakfast ? "active" : ""}`}
            type="button"
            onClick={() => toggle("breakfast")}
          >
            <span className="toggle-icon">
              <Coffee size={16} />
            </span>
            <span className="toggle-copy">
              <strong>{bi("含早餐", "Breakfast")}</strong>
              <small>{bi("至少一个平台提供", "Available on at least one platform")}</small>
            </span>
            <span className="switch" />
          </button>
          <button
            className={`toggle-row ${filters.freeCancel ? "active" : ""}`}
            type="button"
            onClick={() => toggle("freeCancel")}
          >
            <span className="toggle-icon">
              <ShieldCheck size={16} />
            </span>
            <span className="toggle-copy">
              <strong>{bi("免费取消", "Free cancellation")}</strong>
              <small>{bi("行程变化更有余地", "More flexibility if plans change")}</small>
            </span>
            <span className="switch" />
          </button>
          <button
            className={`toggle-row ${filters.favoritesOnly ? "active" : ""}`}
            type="button"
            onClick={() => toggle("favoritesOnly")}
          >
            <span className="toggle-icon">
              <Heart size={16} />
            </span>
            <span className="toggle-copy">
              <strong>{bi("仅看收藏", "Favorites only")}</strong>
              <small>{bi("从心愿单里挑选", "Choose from your saved hotels")}</small>
            </span>
            <span className="switch" />
          </button>
        </div>

        <div className="filter-result-count">
          <span>{resultCount}</span> {bi("家符合你的条件", "hotels match")}
        </div>

        <button className="mobile-filter-done" type="button" onClick={onClose}>
          {bi(`查看 ${resultCount} 家酒店`, `Show ${resultCount} hotels`)}
        </button>
      </aside>
    </>
  );
}
