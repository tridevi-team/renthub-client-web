import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const dashboardId = {
  root: 'dashboard',
  index: 'dashboard:index',
} as const;

export const dashboardPath = {
  root: '/',
  index: '',
} as const;

const dashboardIndexRoute = {
  id: dashboardId.index,
  index: true,
  lazy: async () => {
    const dashboard = await import('./pages/dashboard.page.tsx');

    return {
      loader: dashboard.loader,
      element: <dashboard.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} as const satisfies RouteObject;

export const dashboardRoute = {
  id: dashboardId.root,
  path: dashboardPath.root,
  element: <PageWrapper />,
  children: [dashboardIndexRoute],
} satisfies RouteObject;
