import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cityMeta } from "./data/locations";

const LanguageContext = createContext(null);

const amenityNamesEn = {
  健身房: "Gym",
  行李寄存: "Luggage storage",
  "24h前台": "24h front desk",
  "免费Wi-Fi": "Free Wi-Fi",
  停车场: "Parking",
  洗衣房: "Laundry",
  咖啡机: "Coffee machine",
  泳池: "Pool",
  早餐: "Breakfast",
  接送服务: "Airport shuttle",
  会议室: "Meeting room",
  儿童设施: "Kids' facilities",
};

const salesHintEn = {
  low7: "7-day low",
  member: "Member rate",
  today: "Available today",
};

const providerNamesEn = {
  美团: "Meituan",
  携程: "Trip.com",
  飞猪: "Fliggy",
  Booking: "Booking",
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = window.localStorage.getItem("zhudezhi-language");
    return saved === "en" ? "en" : "zh";
  });

  useEffect(() => {
    window.localStorage.setItem("zhudezhi-language", lang);
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.title =
      lang === "en"
        ? "StayWise · Hotel price comparison"
        : "住得值 · 酒店比价与智能推荐";
  }, [lang]);

  const value = useMemo(() => {
    const bi = (zh, en) => (lang === "en" ? en : zh);
    const locale = lang === "en" ? "en-US" : "zh-CN";
    const number = (value) => Number(value).toLocaleString(locale);

    return {
      lang,
      setLang,
      toggleLanguage: () => setLang((current) => (current === "zh" ? "en" : "zh")),
      bi,
      locale,
      number,
      city: (city) => cityMeta[city]?.[lang] ?? city,
      hotelName: (hotel) => (lang === "en" ? hotel.nameEn ?? hotel.name : hotel.name),
      hotelArea: (hotel) => (lang === "en" ? hotel.areaEn ?? hotel.area : hotel.area),
      hotelStyle: (hotel) => (lang === "en" ? hotel.styleEn ?? hotel.style : hotel.style),
      hotelNearby: (hotel) =>
        lang === "en" ? hotel.nearbyEn ?? hotel.nearby : hotel.nearby,
      hotelReview: (hotel) =>
        lang === "en" ? hotel.reviewEn ?? hotel.review : hotel.review,
      hotelRoom: (hotel) =>
        lang === "en" ? hotel.roomTypeEn ?? hotel.roomType : hotel.roomType,
      amenity: (name) => (lang === "en" ? amenityNamesEn[name] ?? name : name),
      provider: (name) => (lang === "en" ? providerNamesEn[name] ?? name : name),
      salesHint: (key) => (lang === "en" ? salesHintEn[key] ?? key : {
        low7: "近 7 天低价",
        member: "会员专享",
        today: "今日可订",
      }[key] ?? key),
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
