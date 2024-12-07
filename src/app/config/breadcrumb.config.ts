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
  '/users': {
    label: 'br_users',
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
  '/rooms': {
    label: 'br_rooms',
    children: {
      '/create': {
        label: 'br_rooms_create',
      },
      '/:id/edit': {
        label: 'br_rooms_edit',
        dynamicSegments: [':id'],
      },
      '/:id/preview': {
        label: 'br_rooms_preview',
        dynamicSegments: [':id'],
      },
    },
  },
  '/equipments': {
    label: 'br_equipments',
    children: {
      '/create': {
        label: 'br_equipments_create',
      },
      '/:id/edit': {
        label: 'br_equipments_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/services': {
    label: 'br_services',
    children: {
      '/create': {
        label: 'br_services_create',
      },
      '/:id/edit': {
        label: 'br_services_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/bills': {
    label: 'br_bills',
    children: {
      '/create': {
        label: 'br_bills_create',
      },
      '/:id/edit': {
        label: 'br_bills_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/payments': {
    label: 'br_payments',
    children: {
      '/create': {
        label: 'br_payments_create',
      },
      '/:id/edit': {
        label: 'br_payments_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/contract-templates': {
    label: 'br_contract_template',
    children: {
      '/create': {
        label: 'br_contract_template_create',
      },
      '/:id/edit': {
        label: 'br_contract_template_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/renters': {
    label: 'br_renters',
    children: {
      '/create': {
        label: 'br_renters_create',
      },
      '/:id/edit': {
        label: 'br_renters_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/contracts': {
    label: 'br_contracts',
    children: {
      '/create': {
        label: 'br_contracts_create',
      },
      '/:id/edit': {
        label: 'br_contracts_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/issues': {
    label: 'br_issues',
    children: {
      '/process': {
        label: 'br_issues_process',
      },
    },
  },
  '/notifications': {
    label: 'br_notifications',
    children: {
      '/create': {
        label: 'br_notifications_create',
      },
      '/:id/edit': {
        label: 'br_notifications_edit',
        dynamicSegments: [':id'],
      },
    },
  },
  '/stats-bills': {
    label: 'br_stats_bill',
  },
};
