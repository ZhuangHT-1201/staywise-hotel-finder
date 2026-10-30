export const cityMeta = {
  上海: {
    zh: "上海",
    en: "Shanghai",
    aliases: ["shanghai", "沪"],
    center: { lat: 31.2304, lng: 121.4737 },
  },
  杭州: {
    zh: "杭州",
    en: "Hangzhou",
    aliases: ["hangzhou", "杭"],
    center: { lat: 30.2741, lng: 120.1551 },
  },
  成都: {
    zh: "成都",
    en: "Chengdu",
    aliases: ["chengdu", "蓉"],
    center: { lat: 30.5728, lng: 104.0668 },
  },
  三亚: {
    zh: "三亚",
    en: "Sanya",
    aliases: ["sanya", "亚"],
    center: { lat: 18.2528, lng: 109.5119 },
  },
  北京: {
    zh: "北京",
    en: "Beijing",
    aliases: ["beijing", "京"],
    center: { lat: 39.9042, lng: 116.4074 },
  },
  深圳: {
    zh: "深圳",
    en: "Shenzhen",
    aliases: ["shenzhen", "鹏城"],
    center: { lat: 22.5431, lng: 114.0579 },
  },
};

export const placePresets = [
  {
    id: "beihang-shahe",
    zh: "北京航空航天大学沙河校区",
    en: "Beihang University Shahe Campus",
    city: "北京",
    kind: "校园",
    aliases: ["北航沙河", "北航沙河校区", "buaa shahe", "beihang shahe"],
    lat: 40.1024,
    lng: 116.2707,
  },
  {
    id: "beihang-xueyuan",
    zh: "北京航空航天大学学院路校区",
    en: "Beihang University Xueyuan Road Campus",
    city: "北京",
    kind: "校园",
    aliases: ["北航学院路", "buaa xueyuan"],
    lat: 39.9805,
    lng: 116.341,
  },
  {
    id: "beijing-tiananmen",
    zh: "天安门广场",
    en: "Tiananmen Square",
    city: "北京",
    kind: "地标",
    aliases: ["天安门", "tiananmen"],
    lat: 39.9087,
    lng: 116.3975,
  },
  {
    id: "beijing-sanlitun",
    zh: "三里屯太古里",
    en: "Taikoo Li Sanlitun",
    city: "北京",
    kind: "商圈",
    aliases: ["三里屯", "sanlitun"],
    lat: 39.934,
    lng: 116.454,
  },
  {
    id: "beijing-wudaokou",
    zh: "五道口",
    en: "Wudaokou",
    city: "北京",
    kind: "校园商圈",
    aliases: ["wudaokou"],
    lat: 39.9926,
    lng: 116.337,
  },
  {
    id: "beijing-wangjing",
    zh: "望京",
    en: "Wangjing",
    city: "北京",
    kind: "商圈",
    aliases: [],
    lat: 39.9967,
    lng: 116.481,
  },
  {
    id: "beijing-universal",
    zh: "北京环球度假区",
    en: "Universal Beijing Resort",
    city: "北京",
    kind: "乐园",
    aliases: ["环球影城", "universal beijing"],
    lat: 39.855,
    lng: 116.674,
  },
  {
    id: "beijing-south-station",
    zh: "北京南站",
    en: "Beijing South Railway Station",
    city: "北京",
    kind: "车站",
    aliases: ["北京南", "beijing south"],
    lat: 39.865,
    lng: 116.3786,
  },
  {
    id: "shanghai-bund",
    zh: "外滩",
    en: "The Bund",
    city: "上海",
    kind: "地标",
    aliases: ["the bund", "bund"],
    lat: 31.24,
    lng: 121.49,
  },
  {
    id: "shanghai-wukang",
    zh: "武康路",
    en: "Wukang Road",
    city: "上海",
    kind: "街区",
    aliases: ["wukang road"],
    lat: 31.207,
    lng: 121.436,
  },
  {
    id: "shanghai-jingan",
    zh: "静安寺",
    en: "Jing'an Temple",
    city: "上海",
    kind: "商圈",
    aliases: ["jingan temple"],
    lat: 31.223,
    lng: 121.445,
  },
  {
    id: "shanghai-lujiazui",
    zh: "陆家嘴",
    en: "Lujiazui",
    city: "上海",
    kind: "商圈",
    aliases: [],
    lat: 31.2397,
    lng: 121.4998,
  },
  {
    id: "shanghai-disney",
    zh: "上海迪士尼度假区",
    en: "Shanghai Disney Resort",
    city: "上海",
    kind: "乐园",
    aliases: ["迪士尼", "shanghai disney"],
    lat: 31.1443,
    lng: 121.657,
  },
  {
    id: "shanghai-hongqiao",
    zh: "上海虹桥机场",
    en: "Shanghai Hongqiao Airport",
    city: "上海",
    kind: "机场",
    aliases: ["虹桥机场", "hongqiao airport"],
    lat: 31.1979,
    lng: 121.3363,
  },
  {
    id: "hangzhou-westlake",
    zh: "西湖断桥",
    en: "Broken Bridge, West Lake",
    city: "杭州",
    kind: "地标",
    aliases: ["西湖", "断桥", "west lake"],
    lat: 30.2591,
    lng: 120.1483,
  },
  {
    id: "hangzhou-lingyin",
    zh: "灵隐寺",
    en: "Lingyin Temple",
    city: "杭州",
    kind: "地标",
    aliases: ["灵隐", "lingyin temple"],
    lat: 30.2407,
    lng: 120.1025,
  },
  {
    id: "hangzhou-longjing",
    zh: "龙井村",
    en: "Longjing Village",
    city: "杭州",
    kind: "茶园",
    aliases: ["龙井", "longjing"],
    lat: 30.2236,
    lng: 120.1025,
  },
  {
    id: "hangzhou-east",
    zh: "杭州东站",
    en: "Hangzhou East Railway Station",
    city: "杭州",
    kind: "车站",
    aliases: ["杭州东", "hangzhou east"],
    lat: 30.2915,
    lng: 120.2121,
  },
  {
    id: "hangzhou-alibaba",
    zh: "阿里巴巴西溪园区",
    en: "Alibaba Xixi Campus",
    city: "杭州",
    kind: "园区",
    aliases: ["阿里西溪", "alibaba xixi"],
    lat: 30.2793,
    lng: 120.0584,
  },
  {
    id: "chengdu-taikooli",
    zh: "成都太古里",
    en: "Taikoo Li Chengdu",
    city: "成都",
    kind: "商圈",
    aliases: ["太古里", "taikoo li chengdu"],
    lat: 30.6529,
    lng: 104.0812,
  },
  {
    id: "chengdu-kuanzhai",
    zh: "宽窄巷子",
    en: "Kuanzhai Alley",
    city: "成都",
    kind: "地标",
    aliases: ["宽窄巷", "kuanzhai"],
    lat: 30.666,
    lng: 104.055,
  },
  {
    id: "chengdu-east",
    zh: "成都东站",
    en: "Chengdu East Railway Station",
    city: "成都",
    kind: "车站",
    aliases: ["成都东", "chengdu east"],
    lat: 30.6297,
    lng: 104.1418,
  },
  {
    id: "chengdu-luxelakes",
    zh: "麓湖",
    en: "Luxelakes",
    city: "成都",
    kind: "湖区",
    aliases: ["麓湖生态城", "luxelakes"],
    lat: 30.4476,
    lng: 104.0736,
  },
  {
    id: "sanya-yalong",
    zh: "亚龙湾",
    en: "Yalong Bay",
    city: "三亚",
    kind: "海滩",
    aliases: ["yalong bay"],
    lat: 18.2255,
    lng: 109.6385,
  },
  {
    id: "sanya-haitang",
    zh: "海棠湾",
    en: "Haitang Bay",
    city: "三亚",
    kind: "海滩",
    aliases: ["haitang bay"],
    lat: 18.302,
    lng: 109.739,
  },
  {
    id: "sanya-dadonghai",
    zh: "大东海",
    en: "Dadonghai",
    city: "三亚",
    kind: "海滩",
    aliases: ["dadonghai"],
    lat: 18.2227,
    lng: 109.5227,
  },
  {
    id: "sanya-airport",
    zh: "三亚凤凰机场",
    en: "Sanya Phoenix Airport",
    city: "三亚",
    kind: "机场",
    aliases: ["凤凰机场", "sanya airport"],
    lat: 18.3035,
    lng: 109.412,
  },
  {
    id: "shenzhen-north",
    zh: "深圳北站",
    en: "Shenzhen North Railway Station",
    city: "深圳",
    kind: "车站",
    aliases: ["深圳北", "shenzhen north"],
    lat: 22.6092,
    lng: 114.029,
  },
  {
    id: "shenzhen-futian",
    zh: "福田 CBD",
    en: "Futian CBD",
    city: "深圳",
    kind: "商圈",
    aliases: ["福田", "futian"],
    lat: 22.541,
    lng: 114.057,
  },
  {
    id: "shenzhen-bay",
    zh: "深圳湾公园",
    en: "Shenzhen Bay Park",
    city: "深圳",
    kind: "公园",
    aliases: ["深圳湾", "shenzhen bay"],
    lat: 22.5215,
    lng: 113.945,
  },
  {
    id: "shenzhen-oct",
    zh: "华侨城",
    en: "OCT Loft",
    city: "深圳",
    kind: "街区",
    aliases: ["oct", "oct loft"],
    lat: 22.5393,
    lng: 113.9837,
  },
  {
    id: "shenzhen-airport",
    zh: "深圳宝安机场",
    en: "Shenzhen Bao'an Airport",
    city: "深圳",
    kind: "机场",
    aliases: ["宝安机场", "shenzhen airport"],
    lat: 22.6393,
    lng: 113.8107,
  },
];

export const areaCoordinates = {
  上海: {
    外滩: [31.24, 121.49],
    静安寺: [31.223, 121.445],
    陆家嘴: [31.2397, 121.4998],
    武康路: [31.207, 121.436],
    人民广场: [31.2304, 121.4737],
    前滩: [31.1545, 121.4788],
  },
  杭州: {
    湖滨: [30.2549, 120.1623],
    西湖景区: [30.2431, 120.1508],
    灵隐: [30.2407, 120.1025],
    钱江新城: [30.2467, 120.2108],
    运河商圈: [30.3194, 120.1422],
    龙井: [30.2236, 120.1025],
  },
  成都: {
    太古里: [30.6529, 104.0812],
    春熙路: [30.6574, 104.081],
    宽窄巷子: [30.666, 104.055],
    望平街: [30.657, 104.098],
    天府广场: [30.6574, 104.0656],
    麓湖: [30.4476, 104.0736],
  },
  三亚: {
    亚龙湾: [18.2255, 109.6385],
    海棠湾: [18.302, 109.739],
    三亚湾: [18.2556, 109.4566],
    大东海: [18.2227, 109.5227],
    蜈支洲岛: [18.3132, 109.763],
    崖州湾: [18.357, 109.162],
  },
  北京: {
    三里屯: [39.934, 116.454],
    国贸: [39.909, 116.461],
    王府井: [39.915, 116.411],
    后海: [39.94, 116.386],
    望京: [39.9967, 116.481],
    中关村: [39.982, 116.311],
    沙河高教园: [40.104, 116.272],
    沙河: [40.126, 116.276],
  },
  深圳: {
    深圳湾: [22.5215, 113.945],
    "福田 CBD": [22.541, 114.057],
    南山: [22.5333, 113.9304],
    华侨城: [22.5393, 113.9837],
    罗湖: [22.5485, 114.1315],
    大鹏: [22.5967, 114.4798],
  },
};

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[·,，。()（）\-_/]/g, "");

export function cityName(city, lang = "zh") {
  return cityMeta[city]?.[lang] ?? city;
}

export function getAreaCoordinates(city, area) {
  const coords = areaCoordinates[city]?.[area];
  if (coords) return { lat: coords[0], lng: coords[1] };
  return cityMeta[city]?.center ?? cityMeta.上海.center;
}

export function findCityInText(text, fallbackCity = "上海") {
  const normalized = normalize(text);
  return (
    Object.entries(cityMeta).find(
      ([city, meta]) =>
        normalized.includes(normalize(city)) ||
        meta.aliases.some((alias) => normalized.includes(normalize(alias))),
    )?.[0] ?? fallbackCity
  );
}

export function resolvePlace(query, fallbackCity = "上海") {
  const normalized = normalize(query);
  if (!normalized) {
    const city = cityMeta[fallbackCity] ? fallbackCity : "上海";
    return {
      id: `center-${city}`,
      zh: `${cityMeta[city].zh}市中心`,
      en: `${cityMeta[city].en} city center`,
      city,
      kind: "城市",
      lat: cityMeta[city].center.lat,
      lng: cityMeta[city].center.lng,
      precision: "city",
      isApproximate: false,
    };
  }

  const place = placePresets.find(
    (item) =>
      normalize(item.zh).includes(normalized) ||
      normalized.includes(normalize(item.zh)) ||
      normalize(item.en).includes(normalized) ||
      item.aliases.some(
        (alias) =>
          normalize(alias).includes(normalized) || normalized.includes(normalize(alias)),
      ),
  );
  if (place) return { ...place, precision: "exact", isApproximate: false };

  const city = findCityInText(query, fallbackCity);
  return {
    id: `custom-${city}-${normalized.slice(0, 16)}`,
    zh: String(query).trim(),
    en: String(query).trim(),
    city,
    kind: "自定义地点",
    lat: cityMeta[city].center.lat,
    lng: cityMeta[city].center.lng,
    precision: "city",
    isApproximate: true,
  };
}

export function getPlaceSuggestions(query, city, lang = "zh", limit = 7) {
  const normalized = normalize(query);
  const cityMatches = placePresets.filter((place) => place.city === city);
  const pool = query ? placePresets : cityMatches.length ? cityMatches : placePresets;
  const searched = !normalized
    ? pool
    : pool.filter(
        (place) =>
          normalize(place[lang]).includes(normalized) ||
          normalize(place.zh).includes(normalized) ||
          normalize(place.en).includes(normalized) ||
          place.aliases.some((alias) => normalize(alias).includes(normalized)),
      );

  return [...searched]
    .sort((a, b) => {
      const aStarts = normalize(a[lang]).startsWith(normalized) ? 0 : 1;
      const bStarts = normalize(b[lang]).startsWith(normalized) ? 0 : 1;
      return aStarts - bStarts || a.city.localeCompare(b.city);
    })
    .slice(0, limit);
}

export function getDistanceKm(a, b) {
  if (!a || !b) return 0;
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const latDelta = toRadians(b.lat - a.lat);
  const lngDelta = toRadians(b.lng - a.lng);
  const startLat = toRadians(a.lat);
  const endLat = toRadians(b.lat);
  const h =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

export function getMidpoint(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    id: "meeting-midpoint",
    zh: "约会中点",
    en: "Meeting midpoint",
    city: a.city,
    kind: "中点",
    lat: (a.lat + b.lat) / 2,
    lng: (a.lng + b.lng) / 2,
    precision: "midpoint",
    isApproximate: false,
  };
}

export function placeName(place, lang = "zh") {
  if (!place) return "";
  return lang === "en" ? place.en || place.zh : place.zh || place.en;
}

export function formatDistance(km, lang = "zh") {
  if (km < 1) {
    const meters = Math.max(50, Math.round((km * 1000) / 10) * 10);
    return lang === "en" ? `${meters} m` : `${meters}m`;
  }
  return lang === "en" ? `${km.toFixed(1)} km` : `${km.toFixed(1)}km`;
}
