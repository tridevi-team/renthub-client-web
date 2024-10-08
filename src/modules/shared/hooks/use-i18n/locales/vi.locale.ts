import { breadcrumbLocale } from '@shared/hooks/use-i18n/locales/vi/breadcrumb.locale';
import { commonLocale } from '@shared/hooks/use-i18n/locales/vi/common.locale';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { menuLocale } from '@shared/hooks/use-i18n/locales/vi/menu.locale';
import { messageLocale } from '@shared/hooks/use-i18n/locales/vi/message.locale';
import { authLocale } from '@shared/hooks/use-i18n/locales/vi/modules/auth.locale';
import { dashboardLocale } from '@shared/hooks/use-i18n/locales/vi/modules/dashboard.locale';
import { placeholderLocale } from '@shared/hooks/use-i18n/locales/vi/placeholder.locale';

export type LocaleKeys =
  | keyof typeof authLocale
  | keyof typeof errorLocale
  | keyof typeof messageLocale
  | keyof typeof commonLocale
  | keyof typeof placeholderLocale
  | keyof typeof dashboardLocale
  | keyof typeof menuLocale
  | keyof typeof breadcrumbLocale;

export const viLocale = {
  ...authLocale,
  ...errorLocale,
  ...messageLocale,
  ...commonLocale,
  ...placeholderLocale,
  ...dashboardLocale,
  ...menuLocale,
  ...breadcrumbLocale,
} as const;
