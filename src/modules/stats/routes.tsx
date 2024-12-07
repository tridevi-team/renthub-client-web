import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const statsId = {
  root: 'stats',
  bill: 'stats:bill',
} as const;

export const statsPath = {
  root: '/',
  bill: 'stats-bills',
} as const;

const statsBillRoute = {
  id: statsId.bill,
  index: true,
  path: statsPath.bill,
  lazy: async () => {
    const index = await import('./pages/stats-bill.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const statsRoute = {
  id: statsId.root,
  path: statsPath.root,
  element: <PageWrapper />,
  children: [statsBillRoute],
} satisfies RouteObject;
