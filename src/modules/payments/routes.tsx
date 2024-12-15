import { PageWrapper } from '@shared/components/page-wrapper.tsx';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const paymentId = {
  root: 'payments',
  index: 'payments:index',
  create: 'payments:create',
  edit: 'payments:edit',
} as const;

export const paymentPath = {
  root: '/payments',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const paymentIndexRoute = {
  id: paymentId.index,
  index: true,
  path: paymentPath.index,
  lazy: async () => {
    const index = await import('./pages/payment-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const paymentRoute = {
  id: paymentId.root,
  path: paymentPath.root,
  element: <PageWrapper />,
  children: [paymentIndexRoute],
} satisfies RouteObject;
