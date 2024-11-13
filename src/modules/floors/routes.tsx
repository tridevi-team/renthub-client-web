import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const floorId = {
  root: 'floor',
  index: 'floor:index',
  create: 'floor:create',
  edit: 'floor:edit',
  preview: 'floor:preview',
} as const;

export const floorPath = {
  root: '/floors',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const floorIndexRoute = {
  id: floorId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/floor-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const floorRoute = {
  id: floorId.root,
  path: floorPath.root,
  element: <PageWrapper />,
  children: [floorIndexRoute],
} satisfies RouteObject;
