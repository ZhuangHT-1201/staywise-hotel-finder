import {
  BedDouble,
  CalendarDays,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import LocationPicker from "./LocationPicker";
import { preferenceOptions, weekday } from "../utils/hotelLogic";
import { useLanguage } from "../i18n";

export default function SearchPanel({
  draft,
  setDraft,
  onSearch,
  onPreferenceChange,
  error,
}) {
  const { lang, bi } = useLanguage();
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const isBetween = draft.mode === "between";

  return (
    <section className="search-shell" aria-label={bi("酒店搜索", "Hotel search")}>
      <div className="search-heading">
        <div>
          <span className="eyebrow">SMART STAY</span>
          <h2>{bi("把行程交给我们比较", "Let your itinerary do the searching")}</h2>
        </div>
        <div className="search-heading__right">
          <div className="search-mode-tabs">
            <button
              className={!isBetween ? "active" : ""}
              type="button"
              onClick={() => update("mode", "single")}
            >
              <MapPin size={13} />
              {bi("地点找房", "Near a place")}
            </button>
            <button
              className={isBetween ? "active" : ""}
              type="button"
              onClick={() => update("mode", "between")}
            >
              <Heart size={13} />
              {bi("双点约会", "Date midpoint")}
            </button>
          </div>
          <div className="search-proof">
            <span className="pulse-dot" />
            {bi("模拟聚合 4 个平台报价", "Demo prices across 4 platforms")}
          </div>
        </div>
      </div>

      <div className={`search-form ${isBetween ? "search-form--between" : ""}`}>
        {isBetween ? (
          <div className="meetup-location-pair">
            <LocationPicker
              label={bi("我的位置", "My place")}
              value={draft.destination}
              onChange={(value) => update("destination", value)}
              placeholder={bi("学校、公司或商圈", "School, office or district")}
              cityHint={draft.cityHint}
              compact
              ariaLabel={bi("我的位置", "My place")}
            />
            <span className="meetup-heart" aria-hidden="true">
              <Heart size={14} />
            </span>
            <LocationPicker
              label={bi("TA 的位置", "Their place")}
              value={draft.secondaryDestination}
              onChange={(value) => update("secondaryDestination", value)}
              placeholder={bi("约会地点或对方位置", "Date spot or their location")}
              cityHint={draft.cityHint}
              compact
              ariaLabel={bi("TA 的位置", "Their place")}
            />
          </div>
        ) : (
          <LocationPicker
            label={bi("入住地点 / 具体地标", "Stay near / landmark")}
            value={draft.destination}
            onChange={(value) => update("destination", value)}
            placeholder={bi("试试：北京航空航天大学沙河校区", "Try: Beihang University Shahe Campus")}
            cityHint={draft.cityHint}
            ariaLabel={bi("目的地", "Destination")}
          />
        )}

        <div className="search-field date-field">
          <span className="field-label">{bi("入住日期", "Check-in")}</span>
          <span className="field-control">
            <CalendarDays size={18} />
            <input
              type="date"
              value={draft.checkIn}
              min={draft.today}
              onChange={(event) => update("checkIn", event.target.value)}
              aria-label={bi("入住日期", "Check-in date")}
            />
          </span>
          <span className="field-sub">
            {weekday(draft.checkIn, lang)} {bi("入住", "check-in")}
          </span>
        </div>

        <div className="search-field date-field">
          <span className="field-label">{bi("退房日期", "Check-out")}</span>
          <span className="field-control">
            <CalendarDays size={18} />
            <input
              type="date"
              value={draft.checkOut}
              min={draft.checkIn}
              onChange={(event) => update("checkOut", event.target.value)}
              aria-label={bi("退房日期", "Check-out date")}
            />
          </span>
          <span className="field-sub">
            {weekday(draft.checkOut, lang)} {bi("退房", "check-out")}
          </span>
        </div>

        <label className="search-field guest-field">
          <span className="field-label">{bi("住客 / 房间", "Guests / rooms")}</span>
          <span className="field-control">
            <Users size={18} />
            <select
              value={`${draft.guests}-${draft.rooms}`}
              onChange={(event) => {
                const [guests, rooms] = event.target.value.split("-").map(Number);
                setDraft((current) => ({ ...current, guests, rooms }));
              }}
              aria-label={bi("住客人数和房间数", "Guests and rooms")}
            >
              {[1, 2, 3, 4, 5, 6].map((guests) =>
                [1, 2, 3].map((rooms) => (
                  <option key={`${guests}-${rooms}`} value={`${guests}-${rooms}`}>
                    {guests}{" "}
                    {lang === "en" ? (guests === 1 ? "guest" : "guests") : "位"} · {rooms}{" "}
                    {lang === "en" ? (rooms === 1 ? "room" : "rooms") : "间"}
                  </option>
                )),
              )}
            </select>
          </span>
          <BedDouble className="field-chevron" size={16} />
        </label>

        <button className="search-submit" type="button" onClick={onSearch}>
          <Search size={20} />
          {bi("帮我找酒店", "Find my hotel")}
        </button>
      </div>

      <div className="preference-row">
        <span className="preference-label">
          <SlidersHorizontal size={15} />
          {bi("我的偏好", "My priority")}
        </span>
        <div className="preference-pills">
          {Object.entries(preferenceOptions).map(([key, option]) => (
            <button
              key={key}
              className={draft.preference === key ? "active" : ""}
              type="button"
              onClick={() => onPreferenceChange(key)}
            >
              {key === "quality" && <Sparkles size={14} />}
              {lang === "en" ? option.labelEn : option.label}
            </button>
          ))}
        </div>
        <span className="preference-description">
          {lang === "en"
            ? preferenceOptions[draft.preference].descriptionEn
            : preferenceOptions[draft.preference].description}
        </span>
        <span className="location-search-hint">
          <MapPin size={12} />
          {bi(
            "可搜索大学、公司、车站或具体商圈",
            "Search a campus, office, station or specific district",
          )}
        </span>
      </div>

      {error && <div className="form-error">{error}</div>}
    </section>
  );
}
