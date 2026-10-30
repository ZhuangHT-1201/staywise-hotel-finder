import { getDistanceKm, getMidpoint } from "../data/locations";

export const preferenceOptions = {
  value: {
    label: "最划算",
    labelEn: "Best Value",
    description: "优先压低真实总价",
    descriptionEn: "Lowest total price comes first",
    weights: { price: 0.72, rating: 0.12, location: 0.08, perks: 0.08 },
  },
  balanced: {
    label: "综合优选",
    labelEn: "Balanced",
    description: "价格、品质与体验平衡",
    descriptionEn: "A balance of price, quality and comfort",
    weights: { price: 0.48, rating: 0.24, location: 0.16, perks: 0.12 },
  },
  quality: {
    label: "住得更好",
    labelEn: "Best Stay",
    description: "优先评分、位置和早餐",
    descriptionEn: "Rating, location and perks come first",
    weights: { price: 0.24, rating: 0.38, location: 0.2, perks: 0.18 },
  },
};

export const sortOptions = [
  { value: "recommended", label: "智能推荐", labelEn: "Smart ranking" },
  { value: "price", label: "总价最低", labelEn: "Lowest total" },
  { value: "rating", label: "评分最高", labelEn: "Top rated" },
  { value: "distance", label: "位置最近", labelEn: "Closest" },
];

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  return Math.max(1, Math.round((end - start) / 86_400_000));
}

export function formatDate(value, lang = "zh") {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (lang === "en") {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function weekday(value, lang = "zh") {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (lang === "en") {
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  }
  return `周${"日一二三四五六"[date.getDay()]}`;
}

export function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function todayISO() {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function rankHotels(hotels, preference) {
  if (!hotels.length) return [];
  const weights = preferenceOptions[preference]?.weights ?? preferenceOptions.balanced.weights;
  const prices = hotels.map((hotel) => hotel.bestPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const maxDistance = Math.max(
    ...hotels.map((hotel) => (hotel.locationDistanceKm ?? hotel.distance / 1000) * 1000),
    1,
  );
  const priceRange = Math.max(1, maxPrice - minPrice);

  return hotels
    .map((hotel) => {
      const priceScore = 1 - (hotel.bestPrice - minPrice) / priceRange;
      const ratingScore = Math.max(0, (hotel.rating - 4.2) / 0.8);
      const distanceMeters =
        hotel.locationDistanceKm !== undefined ? hotel.locationDistanceKm * 1000 : hotel.distance;
      const locationScore = 1 - Math.min(distanceMeters, maxDistance) / (maxDistance + 250);
      const perksScore =
        (hotel.breakfast ? 0.42 : 0) +
        (hotel.freeCancel ? 0.38 : 0) +
        Math.min(hotel.amenities.length / 20, 0.2);
      const rawScore =
        priceScore * weights.price +
        ratingScore * weights.rating +
        locationScore * weights.location +
        perksScore * weights.perks;

      return {
        ...hotel,
        recommendationScore: Math.round(78 + rawScore * 21),
        saving: hotel.highestPrice - hotel.bestPrice,
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
}

export function getPriceTrend(hotel, days = 14) {
  const base = hotel.bestPrice;
  const amplitude = Math.max(22, Math.round(base * 0.055));
  return Array.from({ length: days }, (_, index) => {
    const wave =
      Math.sin((index + hotel.rating * 2) * 1.18) * amplitude +
      Math.cos((index + hotel.distance / 50) * 0.47) * amplitude * 0.45;
    const weekend = [5, 6].includes((new Date().getDay() + index) % 7) ? amplitude * 0.38 : 0;
    return Math.max(Math.round(base * 0.8), Math.round(base + wave + weekend));
  });
}

export function getStayTotal(perNight, nights, rooms) {
  return Math.round(perNight * nights * rooms);
}

export function getPlatformSearchUrl(city, checkIn, checkOut, guests, rooms) {
  const params = new URLSearchParams({
    ss: city,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: String(guests),
    no_rooms: String(rooms),
    group_children: "0",
    selected_currency: "CNY",
  });
  return `https://www.booking.com/searchresults.zh-cn.html?${params.toString()}`;
}

export function dateRangeLabel(checkIn, checkOut) {
  return `${formatDate(checkIn)} — ${formatDate(checkOut)} · ${calculateNights(checkIn, checkOut)} 晚`;
}

export function applySearchDistances(hotels, primary, secondary, mode = "single") {
  const focus = mode === "between" ? getMidpoint(primary, secondary) : primary;

  return hotels.map((hotel) => {
    const point = { lat: hotel.latitude, lng: hotel.longitude };
    const toPrimary = getDistanceKm(primary, point);
    const toSecondary = secondary ? getDistanceKm(secondary, point) : null;
    const toFocus = getDistanceKm(focus, point);
    const locationDistanceKm =
      mode === "between" && secondary
        ? toFocus * 0.58 + ((toPrimary + toSecondary) / 2) * 0.42
        : toPrimary;

    return {
      ...hotel,
      focus,
      distanceToPrimaryKm: toPrimary,
      distanceToSecondaryKm: toSecondary,
      focusDistanceKm: toFocus,
      locationDistanceKm,
      distance: Math.round(locationDistanceKm * 1000),
    };
  });
}

