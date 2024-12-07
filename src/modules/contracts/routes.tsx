import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const contractId = {
  root: 'contract',
  index: 'contract:index',
  create: 'contract:create',
  edit: 'contract:edit',
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

export const contractRoute = {
  id: contractId.root,
  path: contractPath.root,
  element: <PageWrapper />,
  children: [contractIndexRoute],
} satisfies RouteObject;
