import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const houseId = {
  root: 'house',
  index: 'house:index',
  create: 'house:create',
  edit: 'house:edit',
} as const;

export const housePath = {
  root: '/houses',
  index: '/houses/',
  create: '/houses/create',
  edit: '/houses/:id/edit',
} as const;

const houseIndexRoute = {
  id: houseId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/house-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} as const satisfies RouteObject;

export const houseRoute = {
  id: houseId.root,
  path: housePath.root,
  element: <PageWrapper />,
  children: [houseIndexRoute],
} satisfies RouteObject;
