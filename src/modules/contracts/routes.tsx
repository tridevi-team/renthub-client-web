import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const contractId = {
  root: 'contracts',
  index: 'contracts:index',
  create: 'contracts:create',
  edit: 'contracts:edit',
} as const;

export const contractPath = {
  root: '/contracts',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const contractIndexRoute = {
  id: contractId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/contract-index.page');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const contractCreateRoute = {
  id: contractId.create,
  path: contractPath.create,
  index: true,
  lazy: async () => {
    const create = await import('./pages/contract-create.page');

    return {
      loader: create.loader,
      element: <create.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const contractRoute = {
  id: contractId.root,
  path: contractPath.root,
  element: <PageWrapper />,
  children: [contractIndexRoute, contractCreateRoute],
} satisfies RouteObject;
