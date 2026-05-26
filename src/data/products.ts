export interface TeaProduct {
  slug: string;
  name: string;
  category: string;
  country: string;
  countryCode: string;
  oxidation: number;
  price: number;
  description: string;
  taste: string;
  brewTemp: string;
  brewTime: string;
  /** Local SKU image path in /public. Falls back to imageQuery Unsplash if absent. */
  skuImage: string | null;
  imageQuery: string;
  gallery: string[];
}

export const products: TeaProduct[] = [
  {
    slug: "gorniy-ulun",
    name: "Горный улун",
    category: "Улун",
    country: "Тайвань",
    countryCode: "TW",
    oxidation: 40,
    price: 3200,
    skuImage: "/product-gorniy-ulun.png",
    description:
      "Высокогорный улун с пика Алишань. Лёгкий вкус горных склонов, где туман касается листьев на рассвете. Частичная ферментация рождает сложный характер.",
    taste: "Сливочный, орхидейный, с долгим карамельным послевкусием",
    brewTemp: "90°C",
    brewTime: "3 минуты",
    imageQuery: "alishan taiwan mountain tea plantation mist",
    gallery: [
      "oolong tea dry leaves twisted closeup",
      "tea brewing process cup pouring",
      "taiwan mountain landscape green hills",
    ],
  },
  {
    slug: "tumanniy-ulun",
    name: "Туманный улун",
    category: "Улун",
    country: "Китай",
    countryCode: "CN",
    oxidation: 25,
    price: 2800,
    skuImage: "/product-tumanniy-ulun.png",
    description:
      "Ферментированный улунский чай из туманных долин Фуцзяни. Глубокий аромат, мягкое послевкусие. Собран на пике сезона, когда горы утопают в облаках.",
    taste: "Цветочный, медовый, с нотами спелой груши",
    brewTemp: "85°C",
    brewTime: "3 минуты",
    imageQuery: "fujian china tea garden hills",
    gallery: [
      "tieguanyin oolong tea leaf closeup",
      "ceramic teapot tea ceremony pouring",
      "fujian terraced tea fields fog",
    ],
  },
  {
    slug: "lesnoy-sbor",
    name: "Лесной сбор",
    category: "Травяной чай",
    country: "Россия",
    countryCode: "RU",
    oxidation: 0,
    price: 1600,
    skuImage: "/product-lesnoy-sbor.png",
    description:
      "Гармония трав и ягод, собранных вручную в предгорьях Алтая. Брусничный лист, сосновая хвоя и липовый цвет дарят ощущение лесной прогулки.",
    taste: "Ягодный, хвойный, с медовой сладостью липы",
    brewTemp: "95°C",
    brewTime: "6 минут",
    imageQuery: "altai siberia pine forest wild nature",
    gallery: [
      "dried medicinal herbs bundle closeup",
      "lingonberry berries leaves forest floor",
      "herbal tea brewing glass cup",
    ],
  },
  {
    slug: "lugovoy-sbor",
    name: "Луговой сбор",
    category: "Травяной чай",
    country: "Россия",
    countryCode: "RU",
    oxidation: 0,
    price: 1500,
    skuImage: "/product-lugovoy-sbor.png",
    description:
      "Лёгкость, гармония и забота о себе. Травы и цветы с горных лугов Алтая — напиток, который возвращает к естественному ритму.",
    taste: "Цветочно-травяной, мягкий, с естественной сладостью",
    brewTemp: "95°C",
    brewTime: "5 минут",
    imageQuery: "altai wildflower meadow blooming summer",
    gallery: [
      "dried pressed flowers botanical specimen",
      "chamomile cornflower wild herbs bundle",
      "glass teapot floral brew sunlight",
    ],
  },
  {
    slug: "tihiy-vecher",
    name: "Тихий вечер",
    category: "Травяной чай",
    country: "Африка",
    countryCode: "ZA",
    oxidation: 0,
    price: 1700,
    skuImage: "/product-tihiy-vecher.png",
    description:
      "Мягкий и уютный травяной сбор для вечернего расслабления. Южноафриканский ройбуш в основе, дополненный мелиссой, ромашкой и душицей. Способствует спокойному сну.",
    taste: "Мягкий, медово-пряный, с нотами ромашки и ванили",
    brewTemp: "95°C",
    brewTime: "6 минут",
    imageQuery: "rooibos bush south africa landscape",
    gallery: [
      "chamomile flowers field white petals",
      "rooibos tea dried leaves wooden bowl",
      "evening tea cup candle cozy",
    ],
  },
  {
    slug: "vnutrennyaya-tishina",
    name: "Внутренняя тишина",
    category: "Травяной чай",
    country: "Франция",
    countryCode: "FR",
    oxidation: 0,
    price: 1900,
    skuImage: "/product-vnutrennyaya-tishina.png",
    description:
      "Успокаивающий сбор с прованской лавандой и мелиссой. Помогает снять напряжение, восстановить баланс и обрести внутреннюю гармонию. В каждой чашке — поле лаванды в закатном свете.",
    taste: "Цветочный, лавандово-цитрусовый, с мятной свежестью",
    brewTemp: "90°C",
    brewTime: "5 минут",
    imageQuery: "provence lavender rows sunset purple",
    gallery: [
      "dried lavender bundle rustic wooden table",
      "lemon balm melissa herb leaves green",
      "lavender tea cup steam morning",
    ],
  },
];
