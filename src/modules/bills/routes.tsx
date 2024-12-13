import { PageWrapper } from '@shared/components/page-wrapper.tsx';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const billId = {
  root: 'bills',
  index: 'bills:index',
  create: 'bills:create',
  edit: 'bills:edit',
};

export const billPath = {
  root: '/bills',
  index: '',
  create: 'create',
  edit: ':id/edit',
};

const billIndexRoute = {
  id: billId.index,
  index: true,
  path: billPath.index,
  lazy: async () => {
    const index = await import('./pages/bill-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const billCreateRoute = {
  id: billId.create,
  path: billPath.create,
  index: true,
  lazy: async () => {
    const create = await import('./pages/bill-create.page.tsx');

    return {
      loader: create.loader,
      element: <create.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const billRoute = {
  id: billId.root,
  path: billPath.root,
  element: <PageWrapper />,
  children: [billIndexRoute, billCreateRoute],
} satisfies RouteObject;
