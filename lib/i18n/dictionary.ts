export type Locale = "az" | "en" | "ru";

export const locales: Locale[] = ["az", "en", "ru"];

export const dictionary = {
  az: {
    nav: {
      search: "Kirayə axtar",
      post: "Elan yerləşdir",
      how: "Necə işləyir",
      contact: "Əlaqə",
      messages: "Mesajlar",
      favorites: "Favorilər",
      login: "Giriş",
      register: "Qeydiyyat",
      profile: "Profil",
    },
    home: {
      heroTitle1: "Şəhərini seç.",
      heroTitle2: "Evini",
      heroTitle3: "tap.",
      heroSubtitle:
        "Bakı, Gəncə, Sumqayıt və digər şəhərlərdə minlərlə yoxlanılmış icarə elanı — vasitəçisiz, birbaşa ev sahibi ilə əlaqə.",
      city: "Şəhər",
      allCities: "Bütün şəhərlər",
      priceRange: "Qiymət aralığı (₼)",
      all: "Hamısı",
      rooms: "Otaq sayı",
      anyRooms: "Fərq etməz",
      propertyType: "Ev tipi",
      search_btn: "Axtar",
      newest: "Ən yeni elanlar",
      premium: "Premium elanlar",
      seeAll: "Hamısına bax →",
      perMonth: "/ay",
    },
  },
  en: {
    nav: {
      search: "Browse rentals",
      post: "List a property",
      how: "How it works",
      contact: "Contact",
      messages: "Messages",
      favorites: "Favorites",
      login: "Log in",
      register: "Sign up",
      profile: "Profile",
    },
    home: {
      heroTitle1: "Pick your city.",
      heroTitle2: "Find your",
      heroTitle3: "home.",
      heroSubtitle:
        "Thousands of verified rental listings across Baku, Ganja, Sumgait and more — connect directly with the landlord, no middlemen.",
      city: "City",
      allCities: "All cities",
      priceRange: "Price range (₼)",
      all: "Any",
      rooms: "Rooms",
      anyRooms: "Any",
      propertyType: "Property type",
      search_btn: "Search",
      newest: "Newest listings",
      premium: "Premium listings",
      seeAll: "See all →",
      perMonth: "/mo",
    },
  },
  ru: {
    nav: {
      search: "Найти жильё",
      post: "Разместить объявление",
      how: "Как это работает",
      contact: "Контакты",
      messages: "Сообщения",
      favorites: "Избранное",
      login: "Войти",
      register: "Регистрация",
      profile: "Профиль",
    },
    home: {
      heroTitle1: "Выбери город.",
      heroTitle2: "Найди",
      heroTitle3: "жильё.",
      heroSubtitle:
        "Тысячи проверенных объявлений об аренде в Баку, Гяндже, Сумгаите и других городах — напрямую с хозяином, без посредников.",
      city: "Город",
      allCities: "Все города",
      priceRange: "Диапазон цен (₼)",
      all: "Любой",
      rooms: "Количество комнат",
      anyRooms: "Неважно",
      propertyType: "Тип жилья",
      search_btn: "Искать",
      newest: "Новые объявления",
      premium: "Премиум объявления",
      seeAll: "Смотреть все →",
      perMonth: "/мес",
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionary[locale] ?? dictionary.az;
}