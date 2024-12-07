import { PageWrapper } from '@shared/components/page-wrapper.tsx';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const issueId = {
  root: 'issue',
  index: 'issue:index',
  edit: 'issue:edit',
} as const;

export const issuePath = {
  root: '/issues',
  index: '',
  edit: ':id/edit',
} as const;

const issueIndexRoute = {
  id: issueId.index,
  path: issuePath.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/issue-index.page.tsx');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const issueRoute = {
  id: issueId.root,
  path: issuePath.root,
  element: <PageWrapper />,
  children: [issueIndexRoute],
} satisfies RouteObject;
