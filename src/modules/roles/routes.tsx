import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const roleId = {
  root: 'role',
  index: 'role:index',
  create: 'role:create',
  edit: 'role:edit',
} as const;

export const rolePath = {
  root: '/roles',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const roleIndexRoute = {
  id: roleId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/role-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const roleCreateRoute = {
  id: roleId.create,
  path: rolePath.create,
  index: true,
  lazy: async () => {
    const create = await import('./pages/role-create.page.tsx');

    return {
      loader: create.loader,
      element: <create.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const roleRoute = {
  id: roleId.root,
  path: rolePath.root,
  element: <PageWrapper />,
  children: [roleIndexRoute, roleCreateRoute],
} satisfies RouteObject;
