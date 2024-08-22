import type { LocaleDict } from './locale.type';
import { viLocale } from './vi.locale';

const localeDict: LocaleDict = {
  'vi-VN': viLocale,
} as const;

export { localeDict, viLocale };
