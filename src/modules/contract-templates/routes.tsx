import { PageWrapper } from '@shared/components/page-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const contractTemplateId = {
  root: 'contract-template',
  index: 'contract-template:index',
  create: 'contract-template:create',
  edit: 'contract-template:edit',
} as const;

export const contractTemplatePath = {
  root: '/contract-templates',
  index: '',
  create: 'create',
  edit: ':id/edit',
} as const;

const contractTemplateIndexRoute = {
  id: contractTemplateId.index,
  index: true,
  lazy: async () => {
    const index = await import('./pages/contract-template-index.page');

    return {
      loader: index.loader,
      element: <index.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

const contractTemplateCreateRoute = {
  id: contractTemplateId.create,
  index: true,
  path: contractTemplatePath.create,
  lazy: async () => {
    const create = await import('./pages/contract-template-create.page');

    return {
      loader: create.loader,
      element: <create.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} satisfies RouteObject;

export const contractTemplateRoute = {
  id: contractTemplateId.root,
  path: contractTemplatePath.root,
  element: <PageWrapper />,
  children: [contractTemplateIndexRoute, contractTemplateCreateRoute],
} satisfies RouteObject;
