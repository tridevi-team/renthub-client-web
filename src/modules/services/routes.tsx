import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const serviceId = {
  root: 'service',
  index: 'service:index',
  create: 'service:create',
  edit: 'service:edit',
} as const;

export const servicePath = {
  root: '/services',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const serviceIndexRoute = {
  id: serviceId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/service-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const serviceRoute = {
  id: serviceId.root,
  path: servicePath.root,
  element: <PageWrapper />,
  children: [serviceIndexRoute],
} satisfies RouteObject;
