import { breadcrumbLocale } from '@shared/hooks/use-i18n/locales/vi/breadcrumb.locale';
import { buttonLocale } from '@shared/hooks/use-i18n/locales/vi/button.locale';
import { commonLocale } from '@shared/hooks/use-i18n/locales/vi/common.locale';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { menuLocale } from '@shared/hooks/use-i18n/locales/vi/menu.locale';
import { messageLocale } from '@shared/hooks/use-i18n/locales/vi/message.locale';
import { mesureLocale } from '@shared/hooks/use-i18n/locales/vi/mesure.locale';
import { authLocale } from '@shared/hooks/use-i18n/locales/vi/modules/auth.locale';
import { contractTemplatesLocale } from '@shared/hooks/use-i18n/locales/vi/modules/contract-templates.locale';
import { contractLocale } from '@shared/hooks/use-i18n/locales/vi/modules/contract.locale';
import { dashboardLocale } from '@shared/hooks/use-i18n/locales/vi/modules/dashboard.locale';
import { equipmentLocale } from '@shared/hooks/use-i18n/locales/vi/modules/equipment.locale';
import { floorLocale } from '@shared/hooks/use-i18n/locales/vi/modules/floor.locale';
import { houseLocale } from '@shared/hooks/use-i18n/locales/vi/modules/house.locale';
import { roleLocale } from '@shared/hooks/use-i18n/locales/vi/modules/role.locale';
import { roomLocale } from '@shared/hooks/use-i18n/locales/vi/modules/room.locale';
import { serviceLocale } from '@shared/hooks/use-i18n/locales/vi/modules/service.locale';
import { userLocale } from '@shared/hooks/use-i18n/locales/vi/modules/user.locale';
import { placeholderLocale } from '@shared/hooks/use-i18n/locales/vi/placeholder.locale';
import { renterLocale } from '@shared/hooks/use-i18n/locales/vi/modules/renter.locale';
import { issueLocale } from '@shared/hooks/use-i18n/locales/vi/modules/issue.locale';
import { notificationLocale } from '@shared/hooks/use-i18n/locales/vi/modules/notification.locale';
import { billLocale } from '@shared/hooks/use-i18n/locales/vi/modules/bill.locale';
import { paymentLocale } from '@shared/hooks/use-i18n/locales/vi/modules/payment.locale';
import { statsLocale } from '@shared/hooks/use-i18n/locales/vi/modules/stats.locale';

export type LocaleKeys =
  | keyof typeof contractTemplatesLocale
  | keyof typeof statsLocale
  | keyof typeof paymentLocale
  | keyof typeof billLocale
  | keyof typeof notificationLocale
  | keyof typeof issueLocale
  | keyof typeof authLocale
  | keyof typeof serviceLocale
  | keyof typeof roomLocale
  | keyof typeof contractLocale
  | keyof typeof messageLocale
  | keyof typeof commonLocale
  | keyof typeof placeholderLocale
  | keyof typeof dashboardLocale
  | keyof typeof menuLocale
  | keyof typeof buttonLocale
  | keyof typeof breadcrumbLocale
  | keyof typeof mesureLocale
  | keyof typeof floorLocale
  | keyof typeof roleLocale
  | keyof typeof userLocale
  | keyof typeof equipmentLocale
  | keyof typeof houseLocale;

export const viLocale = {
  ...authLocale,
  ...errorLocale,
  ...messageLocale,
  ...commonLocale,
  ...placeholderLocale,
  ...dashboardLocale,
  ...menuLocale,
  ...breadcrumbLocale,
  ...houseLocale,
  ...buttonLocale,
  ...mesureLocale,
  ...floorLocale,
  ...roleLocale,
  ...userLocale,
  ...equipmentLocale,
  ...contractLocale,
  ...roomLocale,
  ...serviceLocale,
  ...contractTemplatesLocale,
  ...renterLocale,
  ...issueLocale,
  ...notificationLocale,
  ...billLocale,
  ...paymentLocale,
  ...statsLocale,
} as const;
