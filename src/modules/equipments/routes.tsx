import { PageWrapper } from '@shared/components/page-wrapper.tsx';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const equipmentId = {
  root: 'equipment',
  index: 'equipment:index',
  create: 'equipment:create',
  edit: 'equipment:edit',
} as const;

export const equipmentPath = {
  root: '/equipments',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const equipmentIndexRoute = {
  id: equipmentId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/equipment-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const equipmentCreateRoute = {
  id: equipmentId.create,
  index: true,
  path: equipmentPath.create,
  lazy: async () => {
    const create = await import('./pages/equipment-create.page.tsx');

    return {
      loader: create.loader,
      element: <create.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const equipmentEditRoute = {
  id: equipmentId.edit,
  index: true,
  path: equipmentPath.edit,
  lazy: async () => {
    const edit = await import('./pages/equipment-edit.page.tsx');

    return {
      loader: edit.loader,
      element: <edit.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const equipmentRoute = {
  id: equipmentId.root,
  path: equipmentPath.root,
  element: <PageWrapper />,
  children: [equipmentIndexRoute, equipmentCreateRoute, equipmentEditRoute],
} satisfies RouteObject;
