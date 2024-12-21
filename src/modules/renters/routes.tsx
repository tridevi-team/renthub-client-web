import { PageWrapper } from '@shared/components/page-wrapper.tsx';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const renterId = {
  root: 'renter',
  index: 'renter:index',
  create: 'renter:create',
  edit: 'renter:edit',
} as const;

export const renterPath = {
  root: '/renters',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const renterIndexRoute = {
  id: renterId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/renter-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const renterCreateRoute = {
  id: renterId.create,
  index: true,
  path: renterPath.create,
  lazy: async () => {
    const index = await import('./pages/renter-create.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const renterRoute = {
  id: renterId.root,
  path: renterPath.root,
  element: <PageWrapper />,
  children: [renterIndexRoute, renterCreateRoute],
} satisfies RouteObject;
