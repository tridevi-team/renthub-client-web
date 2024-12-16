import { PageWrapper } from '@shared/components/page-wrapper.tsx';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const notificationId = {
  root: 'notification',
  index: 'notification:index',
} as const;

export const notificationPath = {
  root: '/notifications',
  index: '',
} as const;

const notificationIndexRoute = {
  id: notificationId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/notification-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const notificationRoute = {
  id: notificationId.root,
  path: notificationPath.root,
  element: <PageWrapper />,
  children: [notificationIndexRoute],
} satisfies RouteObject;
