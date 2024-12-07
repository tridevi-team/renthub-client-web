import { validationLocale } from '@shared/hooks/use-i18n/locales/vi/validation.locale';
import translation from '@shared/hooks/use-i18n/locales/vi/zod.json';
import i18next from 'i18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

// lng and resources key depend on your locale.
i18next.init({
  lng: 'vi',
  resources: {
    vi: {
      zod: translation,
      custom: {
        ...validationLocale,
      },
    },
  },
});
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'custom'] }));

// export configured zod instance
export { z };
