import type { LocaleDictLanguage } from '@app/providers/i18n/context';
import type { viLocale } from '.';

export type LocaleDict = Record<LocaleDictLanguage, Record<string, string>>;

export type Translations = typeof viLocale;
export type InterpolateInner<
  S extends string,
  // biome-ignore lint/complexity/noBannedTypes: intended
  U extends object = {},
> = S extends `${string}{${infer V}}${infer Rest}`
  ? InterpolateInner<Rest, U & { [key in V]: string }>
  : U;

export type Interpolate<S extends keyof Translations> = InterpolateInner<
  Translations[S]
>;

export type Formatter = <
  T extends keyof Translations,
  Payload = Interpolate<T>,
>(
  ...args: keyof Payload extends never
    ? [translation: T]
    : [translation: T, payload: Interpolate<T>]
) => string;
