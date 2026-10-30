import { cityMeta, getAreaCoordinates } from "./locations";

const gallery = [
  "/images/hotel-1.jpg",
  "/images/hotel-2.jpg",
  "/images/hotel-3.jpg",
  "/images/hotel-4.jpg",
  "/images/hotel-5.jpg",
  "/images/hotel-6.jpg",
  "/images/hotel-7.jpg",
  "/images/hotel-8.jpg",
];

const platforms = [
  {
    name: "美团",
    nameEn: "Meituan",
    short: "美",
    color: "#ffc300",
    text: "#302700",
    url: "https://hotel.meituan.com/",
  },
  {
    name: "携程",
    nameEn: "Trip.com",
    short: "携",
    color: "#287dfa",
    text: "#ffffff",
    url: "https://hotels.ctrip.com/",
  },
  {
    name: "飞猪",
    nameEn: "Fliggy",
    short: "飞",
    color: "#ff6a00",
    text: "#ffffff",
    url: "https://www.fliggy.com/hotel/",
  },
  {
    name: "Booking",
    nameEn: "Booking",
    short: "B",
    color: "#17458f",
    text: "#ffffff",
    url: "https://www.booking.com/",
  },
];

const amenitySets = [
  ["健身房", "行李寄存", "24h前台", "免费Wi-Fi", "停车场"],
  ["洗衣房", "行李寄存", "24h前台", "免费Wi-Fi", "咖啡机"],
  ["健身房", "泳池", "早餐", "免费Wi-Fi", "接送服务"],
  ["行李寄存", "24h前台", "免费Wi-Fi", "咖啡机", "洗衣房"],
  ["健身房", "早餐", "免费Wi-Fi", "会议室", "停车场"],
  ["泳池", "早餐", "接送服务", "免费Wi-Fi", "儿童设施"],
];

const reviewSnippets = [
  "房间比照片更通透，床垫和枕头都很舒服。",
  "位置太省心了，附近吃饭和打车都方便。",
  "前台响应很快，提前到店也帮忙寄存了行李。",
  "隔音比预期好，晚睡也没有被走廊声音打扰。",
  "早餐种类不算夸张，但食材新鲜、补餐很及时。",
  "细节做得很认真，下次来还会优先考虑。",
];

const reviewSnippetsEn = [
  "The room felt brighter than the photos, and the bed was exceptionally comfortable.",
  "An effortless location with great food and easy transport nearby.",
  "The front desk responded quickly and stored our bags before check-in.",
  "Better soundproofing than expected; the hallway never disturbed us.",
  "Breakfast was not huge, but everything was fresh and regularly replenished.",
  "A thoughtful stay with the kind of details that make us want to return.",
];

const roomTypes = ["高级大床房", "景观双床房", "行政大床房", "设计套房", "家庭房", "露台景观房"];
const roomTypesEn = [
  "Deluxe King Room",
  "Scenic Twin Room",
  "Executive King Room",
  "Design Suite",
  "Family Room",
  "Terrace View Room",
];

const areaNamesEn = {
  上海: {
    外滩: "The Bund",
    静安寺: "Jing'an Temple",
    陆家嘴: "Lujiazui",
    武康路: "Wukang Road",
    人民广场: "People's Square",
    前滩: "Qiantan",
  },
  杭州: {
    湖滨: "Hubin",
    西湖景区: "West Lake Scenic Area",
    灵隐: "Lingyin",
    钱江新城: "Qianjiang New Town",
    运河商圈: "Grand Canal",
    龙井: "Longjing",
  },
  成都: {
    太古里: "Taikoo Li",
    春熙路: "Chunxi Road",
    宽窄巷子: "Kuanzhai Alley",
    望平街: "Wangping Street",
    天府广场: "Tianfu Square",
    麓湖: "Luxelakes",
  },
  三亚: {
    亚龙湾: "Yalong Bay",
    海棠湾: "Haitang Bay",
    三亚湾: "Sanya Bay",
    大东海: "Dadonghai",
    蜈支洲岛: "Wuzhizhou Island",
    崖州湾: "Yazhou Bay",
  },
  北京: {
    三里屯: "Sanlitun",
    国贸: "Guomao",
    王府井: "Wangfujing",
    后海: "Houhai",
    望京: "Wangjing",
    中关村: "Zhongguancun",
    沙河高教园: "Shahe University Park",
    沙河: "Shahe",
  },
  深圳: {
    深圳湾: "Shenzhen Bay",
    "福田 CBD": "Futian CBD",
    南山: "Nanshan",
    华侨城: "OCT",
    罗湖: "Luohu",
    大鹏: "Dapeng",
  },
};

const styleNamesEn = {
  江景酒店: "River View Hotel",
  精品设计酒店: "Boutique Design Hotel",
  奢华酒店: "Luxury Hotel",
  精品酒店: "Boutique Hotel",
  城市轻居: "Urban Lite Hotel",
  高端酒店: "Upscale Hotel",
  湖景酒店: "Lake View Hotel",
  度假酒店: "Resort",
  院落酒店: "Courtyard Hotel",
  生活方式酒店: "Lifestyle Hotel",
  海滨度假酒店: "Beach Resort",
  亲子度假酒店: "Family Beach Resort",
  海景公寓: "Seaview Apartment",
  海滨酒店: "Beach Hotel",
  海岛度假酒店: "Island Resort",
  商务酒店: "Business Hotel",
  胡同院落: "Hutong Courtyard",
  滨海酒店: "Coastal Hotel",
  快捷酒店: "Express Hotel",
};

const fallbackNamesEn = [
  "Skyline Hotel",
  "Lane Boutique Hotel",
  "Lakeside Lite Stay",
  "Central Wander Hotel",
  "Courtyard Resort",
  "Station Light Hotel",
];

const cityProfiles = {
  上海: {
    aliases: ["shanghai", "沪"],
    hotels: [
      ["外滩云舍·江景酒店", "外滩", 4.8, 1862, 688, 380, 5, "江景酒店"],
      ["静安梧桐公馆", "静安寺", 4.7, 963, 528, 220, 4, "精品设计酒店"],
      ["陆家嘴观澜酒店", "陆家嘴", 4.9, 2451, 868, 520, 5, "奢华酒店"],
      ["武康路小筑", "武康路", 4.6, 782, 399, 310, 4, "精品酒店"],
      ["人民广场轻居", "人民广场", 4.5, 3204, 358, 160, 3, "城市轻居"],
      ["前滩云端酒店", "前滩", 4.7, 646, 618, 760, 5, "高端酒店"],
    ],
    nearby: ["步行到外滩约 8 分钟", "静安寺商圈核心", "地铁 2 号线直达", "梧桐区步行友好", "地铁口约 160 米", "落地窗城市景观"],
    namesEn: [
      "Bund Riverside House",
      "Jing'an Plane Tree Residence",
      "Lujiazui Riverview Hotel",
      "Wukang Road Lodge",
      "People's Square Lite Hotel",
      "Qiantan Skyline Hotel",
    ],
    nearbyEn: [
      "8-minute walk to the Bund",
      "In the heart of Jing'an",
      "Direct Metro Line 2 access",
      "Walkable plane-tree streets",
      "160 m from the metro",
      "Floor-to-ceiling city views",
    ],
  },
  杭州: {
    aliases: ["hangzhou", "杭"],
    hotels: [
      ["西湖汀兰酒店", "湖滨", 4.8, 1688, 618, 260, 5, "湖景酒店"],
      ["北山街山居", "西湖景区", 4.7, 812, 488, 420, 4, "精品酒店"],
      ["灵隐听松别院", "灵隐", 4.6, 527, 428, 680, 4, "度假酒店"],
      ["钱塘新月酒店", "钱江新城", 4.7, 1350, 558, 450, 5, "高端酒店"],
      ["大兜路漫居", "运河商圈", 4.5, 2241, 328, 230, 3, "城市轻居"],
      ["龙井茶园度假酒店", "龙井", 4.9, 726, 968, 1200, 5, "度假酒店"],
    ],
    nearby: ["步行可达湖滨银泰", "西湖边安静一隅", "灵隐寺接驳方便", "江景与城市天际线", "运河夜生活丰富", "推窗见茶山"],
    namesEn: [
      "West Lake Tinglan Hotel",
      "Beishan Road Retreat",
      "Lingyin Pine House",
      "Qiantang Crescent Hotel",
      "Grand Canal Wander Hotel",
      "Longjing Tea Garden Resort",
    ],
    nearbyEn: [
      "Walk to Hubin In77",
      "A quiet corner by West Lake",
      "Easy access to Lingyin Temple",
      "River and skyline views",
      "Close to canal nightlife",
      "Tea hills outside your window",
    ],
  },
  成都: {
    aliases: ["chengdu", "蓉"],
    hotels: [
      ["太古里竹隐酒店", "太古里", 4.8, 2108, 498, 180, 5, "精品设计酒店"],
      ["春熙路漫游酒店", "春熙路", 4.6, 3560, 338, 120, 3, "城市轻居"],
      ["宽窄巷子院落", "宽窄巷子", 4.7, 1048, 458, 350, 4, "院落酒店"],
      ["望平街河畔酒店", "望平街", 4.6, 1522, 388, 260, 4, "生活方式酒店"],
      ["天府中心云庭", "天府广场", 4.8, 1825, 528, 220, 5, "高端酒店"],
      ["麓湖岛屿度假酒店", "麓湖", 4.9, 608, 798, 980, 5, "度假酒店"],
    ],
    nearby: ["步行可达太古里", "春熙路地铁站旁", "院门就在宽窄巷子", "临河夜生活街区", "地铁 1 号线换乘方便", "湖景与草坪环绕"],
    namesEn: [
      "Taikoo Li Bamboo Hotel",
      "Chunxi Road Wanderer",
      "Kuanzhai Courtyard",
      "Wangping Riverside Hotel",
      "Tianfu Cloud Court",
      "Luxelakes Island Resort",
    ],
    nearbyEn: [
      "Walk to Taikoo Li",
      "Beside Chunxi Road metro",
      "At the gate of Kuanzhai Alley",
      "On the riverside nightlife strip",
      "Easy Metro Line 1 transfer",
      "Surrounded by lake and lawns",
    ],
  },
  三亚: {
    aliases: ["sanya", "亚"],
    hotels: [
      ["亚龙湾白鹭度假酒店", "亚龙湾", 4.8, 2874, 988, 180, 5, "海滨度假酒店"],
      ["海棠湾椰风酒店", "海棠湾", 4.7, 1936, 828, 320, 5, "亲子度假酒店"],
      ["三亚湾落日公寓", "三亚湾", 4.5, 3610, 398, 240, 3, "海景公寓"],
      ["大东海蓝屿酒店", "大东海", 4.6, 2210, 518, 160, 4, "海滨酒店"],
      ["蜈支洲岛珊瑚酒店", "蜈支洲岛", 4.9, 836, 1388, 600, 5, "海岛度假酒店"],
      ["崖州湾轻度假", "崖州湾", 4.5, 940, 348, 420, 3, "度假酒店"],
    ],
    nearby: ["私享沙滩入口", "步行到海棠湾海岸", "直面三亚湾落日", "步行约 5 分钟到沙滩", "含岛上接驳", "新城区安静度假"],
    namesEn: [
      "Yalong Bay Egret Resort",
      "Haitang Bay Palm Hotel",
      "Sanya Bay Sunset Apartments",
      "Dadonghai Blue Isle",
      "Wuzhizhou Coral Hotel",
      "Yazhou Bay Retreat",
    ],
    nearbyEn: [
      "Private beach access",
      "Walk to Haitang Bay",
      "Sunset views over Sanya Bay",
      "About a 5-minute walk to the sand",
      "Island shuttle included",
      "A quiet escape in the new district",
    ],
  },
  北京: {
    aliases: ["beijing", "京"],
    hotels: [
      ["三里屯树影酒店", "三里屯", 4.8, 2490, 628, 210, 5, "精品设计酒店"],
      ["国贸天际酒店", "国贸", 4.7, 3166, 688, 180, 5, "商务酒店"],
      ["王府井京韵公馆", "王府井", 4.7, 1252, 568, 280, 4, "精品酒店"],
      ["后海观荷小院", "后海", 4.6, 681, 438, 360, 4, "胡同院落"],
      ["望京轻旅酒店", "望京", 4.4, 1892, 318, 300, 3, "城市轻居"],
      ["中关村知春酒店", "中关村", 4.5, 2310, 378, 240, 3, "商务酒店"],
      ["北航沙河云舍", "沙河高教园", 4.7, 826, 328, 520, 4, "精品酒店"],
      ["沙河地铁站轻居", "沙河", 4.5, 1180, 238, 390, 3, "城市轻居"],
    ],
    nearby: [
      "太古里步行圈",
      "国贸地铁换乘方便",
      "步行可达王府井",
      "胡同临水安静",
      "望京 SOHO 通勤友好",
      "高校与科技园环绕",
      "北航沙河校区步行圈",
      "距沙河地铁站 390 米",
    ],
    namesEn: [
      "Sanlitun Treehouse Hotel",
      "Guomao Skyline Hotel",
      "Wangfujing Capital House",
      "Houhai Lotus Courtyard",
      "Wangjing Light Hotel",
      "Zhongguancun Zhichun Hotel",
      "Beihang Shahe Yunhe Hotel",
      "Shahe Metro Light Stay",
    ],
    nearbyEn: [
      "Taikoo Li within walking distance",
      "Easy Guomao metro transfers",
      "Walk to Wangfujing",
      "Quiet lanes beside Houhai",
      "Convenient for Wangjing SOHO",
      "Surrounded by universities and tech campuses",
      "Near Beihang Shahe Campus",
      "390 m from Shahe metro",
    ],
  },
  深圳: {
    aliases: ["shenzhen", "鹏城"],
    hotels: [
      ["深圳湾拾光酒店", "深圳湾", 4.8, 1748, 638, 260, 5, "滨海酒店"],
      ["福田中心云居", "福田 CBD", 4.7, 2810, 528, 170, 4, "商务酒店"],
      ["南山设计酒店", "南山", 4.6, 1327, 418, 310, 4, "精品设计酒店"],
      ["华侨城绿荫酒店", "华侨城", 4.7, 1620, 488, 380, 4, "生活方式酒店"],
      ["罗湖口岸轻居", "罗湖", 4.4, 3410, 288, 130, 3, "城市轻居"],
      ["大鹏海岸度假酒店", "大鹏", 4.8, 890, 728, 880, 5, "海滨度假酒店"],
    ],
    nearby: ["深圳湾公园步行可达", "会展中心地铁近", "科技园通勤方便", "创意园区环抱", "口岸步行商圈", "私享东部海岸"],
    namesEn: [
      "Shenzhen Bay Shiguang Hotel",
      "Futian Center Cloud Hotel",
      "Nanshan Design Hotel",
      "OCT Green Hotel",
      "Luohu Border Light Hotel",
      "Dapeng Coast Resort",
    ],
    nearbyEn: [
      "Walk to Shenzhen Bay Park",
      "Close to Convention Center metro",
      "Easy commute to tech parks",
      "Surrounded by creative districts",
      "Walkable to the border checkpoint",
      "A private stretch of eastern coast",
    ],
  },
};

function makeOffers(basePrice, hotelIndex, stars) {
  const rotations = [
    [1.015, 0.965, 0.99, 1.07],
    [0.985, 1.025, 0.972, 1.05],
    [1.04, 0.975, 1.012, 1.06],
    [0.99, 1.018, 0.96, 1.08],
    [1.055, 0.98, 1.02, 1.045],
    [1.02, 1.008, 0.982, 1.06],
  ];
  const factors = rotations[hotelIndex % rotations.length];

  return platforms.map((platform, index) => {
    const feeRate = platform.name === "Booking" && hotelIndex % 2 === 0 ? 0.06 : 0;
    const roomPrice = Math.round((basePrice * factors[index] + (hotelIndex % 3) * 3) / 4) * 4 - 1;
    const tax = Math.round(roomPrice * feeRate);
    const breakfast = stars >= 4 && (index + hotelIndex) % 3 !== 0;
    const freeCancel =
      (index + hotelIndex) % 4 !== 2 || platform.name === "携程" || platform.name === "飞猪";

    return {
      ...platform,
      roomPrice,
      tax,
      total: roomPrice + tax,
      breakfast,
      freeCancel,
      member: index === 1 || index === 3,
    };
  });
}

function createHotel(city, seed, index, isFallback = false) {
  const [name, area, rating, reviewCount, basePrice, distance, stars, style] = seed;
  const offers = makeOffers(basePrice, index, stars);
  const bestOffer = [...offers].sort((a, b) => a.total - b.total)[0];
  const highestOffer = [...offers].sort((a, b) => b.total - a.total)[0];
  const cityProfile = cityProfiles[city];
  const coordinates = getAreaCoordinates(city, area);
  const cityEnglish = cityMeta[city]?.en ?? city;

  return {
    id: `${isFallback ? `custom-${city}` : city}-${index + 1}`,
    city,
    name,
    nameEn:
      cityProfile?.namesEn?.[index] ?? `${cityEnglish} ${fallbackNamesEn[index % fallbackNamesEn.length]}`,
    area,
    areaEn: areaNamesEn[city]?.[area] ?? area,
    rating,
    reviewCount,
    distance,
    stars,
    style,
    styleEn: styleNamesEn[style] ?? style,
    image: gallery[index % gallery.length],
    roomType: roomTypes[index % roomTypes.length],
    roomTypeEn: roomTypesEn[index % roomTypesEn.length],
    nearby: cityProfile?.nearby[index] ?? "核心商圈步行可达",
    nearbyEn: cityProfile?.nearbyEn?.[index] ?? "Easy access to the main district",
    review: reviewSnippets[index % reviewSnippets.length],
    reviewEn: reviewSnippetsEn[index % reviewSnippetsEn.length],
    amenities: amenitySets[index % amenitySets.length],
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    offers,
    bestPrice: bestOffer.total,
    highestPrice: highestOffer.total,
    bestPlatform: bestOffer.name,
    freeCancel: offers.some((offer) => offer.freeCancel),
    breakfast: offers.some((offer) => offer.breakfast),
    isFallback,
    salesHint:
      index % 3 === 0
        ? "low7"
        : index % 3 === 1
          ? "member"
          : "today",
  };
}

export function getResolvedCity(query) {
  const normalized = query.trim().replace(/\s+/g, "");
  const found = Object.keys(cityProfiles).find(
    (city) =>
      normalized.includes(city) ||
      cityProfiles[city].aliases.some((alias) => normalized.toLowerCase().includes(alias)) ||
      cityProfiles[city].hotels.some(
        (seed) => normalized.includes(seed[1]) || seed[0].includes(normalized),
      ),
  );

  return found ?? (normalized || "上海");
}

export function getHotelsForDestination(query) {
  const city = getResolvedCity(query);
  const profile = cityProfiles[city];

  if (profile) {
    return profile.hotels.map((seed, index) => createHotel(city, seed, index));
  }

  const fallbackSeeds = [
    [`${city}云端酒店`, "市中心", 4.8, 1740, 588, 260, 5, "高端酒店"],
    [`${city}里巷精品酒店`, "老城区", 4.7, 926, 438, 180, 4, "精品设计酒店"],
    [`${city}湖畔轻居`, "滨水区", 4.6, 2860, 328, 430, 3, "城市轻居"],
    [`${city}中心漫游酒店`, "商业中心", 4.6, 1328, 398, 120, 4, "生活方式酒店"],
    [`${city}庭院度假酒店`, "度假区", 4.8, 680, 698, 570, 5, "度假酒店"],
    [`${city}站前轻旅`, "高铁站", 4.4, 2110, 258, 340, 3, "快捷酒店"],
  ];

  return fallbackSeeds.map((seed, index) => createHotel(city, seed, index, true));
}

export const supportedCities = Object.keys(cityProfiles);
export const providerPlatforms = platforms;

