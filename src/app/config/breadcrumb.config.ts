import type { breadcrumbLocale } from '@shared/hooks/use-i18n/locales/vi/breadcrumb.locale';

type BreadcrumbConfig = {
  [key: string]: {
    label: keyof typeof breadcrumbLocale;
    children?: BreadcrumbConfig;
    dynamicSegments?: string[];
  };
};

export const breadcrumbConfig: BreadcrumbConfig = {
  '/': {
    label: 'br_dashboard',
  },
  '/houses': {
    label: 'br_houses',
    children: {
      '/create': {
        label: 'br_houses_create',
      },
      '/:id/edit': {
        label: 'br_houses_edit',
        dynamicSegments: [':id'],
      },
      '/:id/preview': {
        label: 'br_houses_preview',
        dynamicSegments: [':id'],
      },
    },
  },
  '/floors': {
    label: 'br_floors',
  },
  '/roles': {
    label: 'br_roles',
    children: {
      '/create': {
        label: 'br_roles_create',
      },
      '/:id/edit': {
        label: 'br_roles_edit',
        dynamicSegments: [':id'],
      },
    },
  },
};
