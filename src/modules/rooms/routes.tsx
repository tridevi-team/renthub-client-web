import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const roomId = {
  root: 'room',
  index: 'room:index',
  create: 'room:create',
  edit: 'room:edit',
} as const;

export const roomPath = {
  root: '/rooms',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const roomIndexRoute = {
  id: roomId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/room-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const roomCreateRoute = {
  id: roomId.create,
  path: roomPath.create,
  index: true,
  lazy: async () => {
    const create = await import('./pages/room-create.page.tsx');

    return {
      loader: create.loader,
      element: <create.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const roomEditRoute = {
  id: roomId.edit,
  path: roomPath.edit,
  index: true,
  lazy: async () => {
    const edit = await import('./pages/room-edit.page.tsx');

    return {
      loader: edit.loader,
      element: <edit.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const roomRoute = {
  id: roomId.root,
  path: roomPath.root,
  element: <PageWrapper />,
  children: [roomIndexRoute, roomCreateRoute, roomEditRoute],
} satisfies RouteObject;
