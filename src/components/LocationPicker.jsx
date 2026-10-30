import { useRef, useState } from "react";
import { MapPin, Search, Navigation } from "lucide-react";
import { getPlaceSuggestions } from "../data/locations";
import { useLanguage } from "../i18n";

export default function LocationPicker({
  label,
  value,
  onChange,
  placeholder,
  cityHint,
  compact = false,
  ariaLabel,
}) {
  const { lang, city, bi } = useLanguage();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const suggestions = getPlaceSuggestions(value, cityHint, lang, 7);

  function choose(place) {
    onChange(place[lang]);
    setOpen(false);
  }

  return (
    <label className={`location-picker ${compact ? "location-picker--compact" : ""}`}>
      <span className="field-label">{label}</span>
      <span className="location-picker__control">
        <MapPin size={18} />
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            window.clearTimeout(closeTimer.current);
            setOpen(true);
          }}
          onBlur={() => {
            closeTimer.current = window.setTimeout(() => setOpen(false), 130);
          }}
          placeholder={placeholder}
          aria-label={ariaLabel ?? label}
          autoComplete="off"
        />
        {!value && <Search className="location-picker__search-icon" size={14} />}
      </span>

      {open && (
        <span className="location-suggestions" role="listbox">
          <span className="location-suggestions__head">
            <Navigation size={13} />
            {bi("选择具体地标、校区或商圈", "Choose a landmark, campus or district")}
          </span>
          {suggestions.length ? (
            suggestions.map((place) => (
              <button
                key={place.id}
                type="button"
                role="option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(place)}
              >
                <span className="suggestion-pin">
                  <MapPin size={14} />
                </span>
                <span className="suggestion-copy">
                  <strong>{place[lang]}</strong>
                  <small>
                    {city(place.city)} · {bi(place.kind, suggestionKindEn(place.kind))}
                  </small>
                </span>
              </button>
            ))
          ) : (
            <span className="location-suggestions__empty">
              {bi(
                "没有匹配预设，仍可按城市中心估算",
                "No preset match. We can still estimate from the city center.",
              )}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

function suggestionKindEn(kind) {
  return (
    {
      校园: "Campus",
      地标: "Landmark",
      商圈: "District",
      校园商圈: "Campus district",
      乐园: "Theme park",
      车站: "Station",
      机场: "Airport",
      街区: "Neighborhood",
      茶园: "Tea village",
      园区: "Campus",
      湖区: "Lake district",
      海滩: "Beach",
      公园: "Park",
      城市: "City",
    }[kind] ?? kind
  );
}
