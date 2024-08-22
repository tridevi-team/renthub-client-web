import type { breadcrumbLocale } from '@shared/hooks/use-i18n/locales/vi/breadcrumb.locale';

type BreadcrumbConfig = {
  [key: string]: {
    label: keyof typeof breadcrumbLocale;
    parent?: string;
    dynamicSegments?: string[];
  };
};

export const breadcrumbConfig: BreadcrumbConfig = {
  '/': { label: 'br_dashboard' },
  dashboard: { label: 'br_dashboard' },
  users: { label: 'br_users' },
  'users/create': { label: 'br_users_create', parent: 'users' },
  'users/:id/edit': {
    label: 'br_users_edit',
    parent: 'users/:id',
    dynamicSegments: ['id'],
  },
};
