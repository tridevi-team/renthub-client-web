import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const houseId = {
  root: 'house',
  index: 'house:index',
  create: 'house:create',
  edit: 'house:edit',
  preview: 'house:preview',
} as const;

export const housePath = {
  root: '/houses',
  index: '/',
  create: 'create',
  edit: ':id/edit',
  preview: ':id/preview',
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
} satisfies RouteObject;

const houseCreateRoute = {
  id: houseId.create,
  path: housePath.create,
  index: true,
  lazy: async () => {
    const create = await import('./pages/house-create.page.tsx');

    return {
      loader: create.loader,
      element: <create.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const previewRoute = {
  id: houseId.preview,
  path: housePath.preview,
  index: true,
  lazy: async () => {
    const preview = await import('./pages/house-preview.page.tsx');

    return {
      loader: preview.loader,
      element: <preview.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const houseRoute = {
  id: houseId.root,
  path: housePath.root,
  element: <PageWrapper />,
  children: [houseIndexRoute, houseCreateRoute, previewRoute],
} satisfies RouteObject;
