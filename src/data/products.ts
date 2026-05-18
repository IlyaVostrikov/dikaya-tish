export interface TeaProduct {
  slug: string;
  name: string;
  category: string;
  country: string;
  countryFlag: string;
  oxidation: number;
  price: number;
  description: string;
  taste: string;
  brewTemp: string;
  brewTime: string;
  imageQuery: string;
}

export const products: TeaProduct[] = [
  {
    slug: "gorniy-ulun",
    name: "Горный улун",
    category: "Улун",
    country: "Тайвань",
    countryFlag: "🇹🇼",
    oxidation: 40,
    price: 3200,
    description:
      "Высокогорный улун с пика Алишань. Лёгкий вкус горных склонов, где туман касается листьев на рассвете. Частичная ферментация рождает сложный характер.",
    taste: "Сливочный, орхидейный, с долгим карамельным послевкусием",
    brewTemp: "90°C",
    brewTime: "3 минуты",
    imageQuery: "taiwan tea plantation mountain",
  },
  {
    slug: "tumanniy-ulun",
    name: "Туманный улун",
    category: "Улун",
    country: "Китай",
    countryFlag: "🇨🇳",
    oxidation: 25,
    price: 2800,
    description:
      "Ферментированный улунский чай из туманных долин Фуцзяни. Глубокий аромат, мягкое послевкусие. Собран на пике сезона, когда горы утопают в облаках.",
    taste: "Цветочный, медовый, с нотами спелой груши",
    brewTemp: "85°C",
    brewTime: "3 минуты",
    imageQuery: "tea plantation china",
  },
  {
    slug: "lesnoy-sbor",
    name: "Лесной сбор",
    category: "Травяной чай",
    country: "Россия",
    countryFlag: "🇷🇺",
    oxidation: 0,
    price: 1600,
    description:
      "Гармония трав и ягод, собранных вручную в предгорьях Алтая. Брусничный лист, сосновая хвоя и липовый цвет дарят ощущение лесной прогулки.",
    taste: "Ягодный, хвойный, с медовой сладостью липы",
    brewTemp: "95°C",
    brewTime: "6 минут",
    imageQuery: "altai mountains forest nature",
  },
  {
    slug: "lugovoy-sbor",
    name: "Луговой сбор",
    category: "Травяной чай",
    country: "Россия",
    countryFlag: "🇷🇺",
    oxidation: 0,
    price: 1500,
    description:
      "Лёгкость, гармония и забота о себе. Травы и цветы с горных лугов Алтая — напиток, который возвращает к естественному ритму.",
    taste: "Цветочно-травяной, мягкий, с естественной сладостью",
    brewTemp: "95°C",
    brewTime: "5 минут",
    imageQuery: "wildflower meadow mountain herbs",
  },
  {
    slug: "tihiy-vecher",
    name: "Тихий вечер",
    category: "Травяной чай",
    country: "Африка",
    countryFlag: "🌍",
    oxidation: 0,
    price: 1700,
    description:
      "Мягкий и уютный травяной сбор для вечернего расслабления. Южноафриканский ройбуш в основе, дополненный мелиссой, ромашкой и душицей. Способствует спокойному сну.",
    taste: "Мягкий, медово-пряный, с нотами ромашки и ванили",
    brewTemp: "95°C",
    brewTime: "6 минут",
    imageQuery: "rooibos tea plant africa nature",
  },
  {
    slug: "vnutrennyaya-tishina",
    name: "Внутренняя тишина",
    category: "Травяной чай",
    country: "Франция",
    countryFlag: "🇫🇷",
    oxidation: 0,
    price: 1900,
    description:
      "Успокаивающий сбор с прованской лавандой и мелиссой. Помогает снять напряжение, восстановить баланс и обрести внутреннюю гармонию. В каждой чашке — поле лаванды в закатном свете.",
    taste: "Цветочный, лавандово-цитрусовый, с мятной свежестью",
    brewTemp: "90°C",
    brewTime: "5 минут",
    imageQuery: "provence lavender field landscape",
  },
];
