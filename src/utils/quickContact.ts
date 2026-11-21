export const CONTACT_EMAIL = 'milsinery@icloud.com';
export const EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
export const TELEGRAM_HREF = 'https://t.me/milsinery';

// Time zones in Russia (IANA). Detection is client-side only, no third parties.
const RUSSIAN_TIME_ZONES = new Set([
  'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd',
  'Europe/Saratov', 'Europe/Ulyanovsk', 'Europe/Astrakhan', 'Europe/Kirov',
  'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Barnaul',
  'Asia/Tomsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk',
  'Asia/Chita', 'Asia/Yakutsk', 'Asia/Khandyga', 'Asia/Vladivostok',
  'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Sakhalin', 'Asia/Srednekolymsk',
  'Asia/Kamchatka', 'Asia/Anadyr',
]);

export const isVisitorFromRussia = (): boolean => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && RUSSIAN_TIME_ZONES.has(timeZone)) return true;
  } catch (e) {
    // Ignore: fall back to the language check.
  }
  if (typeof navigator === 'undefined') return false;
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((lang) => /^[a-z]{2,3}-RU\b/i.test(lang || ''));
};

// Telegram for visitors from Russia, email for everyone else.
export const quickContactHref = (): string =>
  isVisitorFromRussia() ? TELEGRAM_HREF : EMAIL_HREF;
