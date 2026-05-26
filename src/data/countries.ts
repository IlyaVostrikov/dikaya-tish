export interface Country {
  slug: string;
  name: string;
  countryCode: string;
  title: string;
  description: string;
  teas: string; // comma-separated tea types
  imageQuery: string;
}

export const countries: Country[] = [
  {
    slug: "russia",
    name: "Россия",
    countryCode: "RU",
    title: "Самый северный чай в мире",
    description:
      "Краснодарский край — единственное место в России, где растёт чай. Горные склоны, южное солнце и холодные ночи создают уникальный вкус — более мягкий, чем у южных собратьев.",
    teas: "Красный чай, Зелёный чай",
    imageQuery: "caucasus mountains nature landscape",
  },
  {
    slug: "china",
    name: "Китай",
    countryCode: "CN",
    title: "Родина чая",
    description:
      "Пять тысяч лет чайной культуры. Юньнань — колыбель диких чайных деревьев. Фуцзянь — утончённые улуны и белые чаи. Каждая провинция — отдельная вселенная вкуса.",
    teas: "Белый чай, Зелёный чай, Жёлтый чай, Улун, Пуэр",
    imageQuery: "tea plantation china",
  },
  {
    slug: "japan",
    name: "Япония",
    countryCode: "JP",
    title: "Тень и точность",
    description:
      "Японский чай — это ритуал. Затенённые плантации, паровая фиксация, порошковая матча. Каждый шаг отточен веками.",
    teas: "Матча, Сенча, Гёкуро, Генмайча",
    imageQuery: "shizuoka green tea field japan",
  },
  {
    slug: "taiwan",
    name: "Тайвань",
    countryCode: "TW",
    title: "Горный туман и улуны",
    description:
      "Высокогорные плантации над облаками. Алишань, Лишань, Дун Дин — имена, которые знает каждый ценитель улуна.",
    teas: "Улун, Чёрный чай, Зелёный чай",
    imageQuery: "taiwan tea plantation alishan",
  },
  {
    slug: "africa",
    name: "Африка",
    countryCode: "ZA",
    title: "Экваториальная сила",
    description:
      "Кения и Малави — мощные, терпкие чаи с вулканических почв. Экваториальное солнце даёт рекордные урожаи и глубокий вкус.",
    teas: "Чёрный чай, Зелёный чай, Ройбуш",
    imageQuery: "kenya tea plantation field",
  },
  {
    slug: "india",
    name: "Индия",
    countryCode: "IN",
    title: "Дарджилинг и Ассам",
    description:
      "Гималайские склоны Дарджилинга — «шампанское среди чаёв». Долина Ассама — родина крепкого чёрного чая. Два полюса одной страны.",
    teas: "Чёрный чай, Белый чай, Зелёный чай",
    imageQuery: "darjeeling tea plantation india",
  },
  {
    slug: "france",
    name: "Франция",
    countryCode: "FR",
    title: "Прованские травы",
    description:
      "Лавандовые поля Прованса, альпийские луга и средиземноморские травы. Французская традиция травяных сборов — это искусство наслаждения и заботы о себе.",
    teas: "Травяной чай, Лавандовый сбор, Ромашковый чай",
    imageQuery: "provence herb field france landscape",
  },
];
