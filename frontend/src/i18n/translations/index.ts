import { az } from './az';
import { en } from './en';
import { ru } from './ru';
import { de } from './de';

export type Language = 'az' | 'en' | 'ru' | 'de';

export const translations = {
  az,
  en,
  ru,
  de,
};

export const languagesConfig: { code: Language; name: string; flag: string }[] = [
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];
