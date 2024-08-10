// import { commonLocale } from '@shared/hooks/use-i18n/locales/vi/common.locale';
// import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
// import { menuLocale } from '@shared/hooks/use-i18n/locales/vi/menu.locale';
// import { messageLocale } from '@shared/hooks/use-i18n/locales/vi/message.locale';
// import { authLocale } from '@shared/hooks/use-i18n/locales/vi/modules/auth.locale';
// import { dashboardLocale } from '@shared/hooks/use-i18n/locales/vi/modules/dashboard.locale';
// import { placeholderLocale } from '@shared/hooks/use-i18n/locales/vi/placeholder.locale';
// import { validationLocale } from '@shared/hooks/use-i18n/locales/vi/validation.locale';

import { commonLocale } from './vi/common.locale';
import { errorLocale } from './vi/error.locale';
import { menuLocale } from './vi/menu.locale';
import { messageLocale } from './vi/message.locale';
import { authLocale } from './vi/modules/auth.locale';
import { dashboardLocale } from './vi/modules/dashboard.locale';
import { placeholderLocale } from './vi/placeholder.locale';
import { validationLocale } from './vi/validation.locale';

export type LocaleKeys =
  | keyof typeof authLocale
  | keyof typeof errorLocale
  | keyof typeof messageLocale
  | keyof typeof commonLocale
  | keyof typeof validationLocale
  | keyof typeof placeholderLocale
  | keyof typeof dashboardLocale
  | keyof typeof menuLocale;

export const viLocale = {
  ...authLocale,
  ...errorLocale,
  ...messageLocale,
  ...commonLocale,
  ...validationLocale,
  ...placeholderLocale,
  ...dashboardLocale,
  ...menuLocale,
} as const;
