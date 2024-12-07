import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const userId = {
  root: 'user',
  index: 'user:index',
} as const;

export const userPath = {
  root: '/users',
  index: '',
} as const;

const userIndexRoute = {
  id: userId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/user-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const userRoute = {
  id: userId.root,
  path: userPath.root,
  element: <PageWrapper />,
  children: [userIndexRoute],
} satisfies RouteObject;
