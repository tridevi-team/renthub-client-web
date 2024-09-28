import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const authId = {
  root: undefined,
  login: 'auth:login',
  register: 'auth:register',
  forgotPassword: 'auth:forgotPassword',
  resetPassword: 'auth:resetPassword',
  verifyAccount: 'auth:verifyAccount',
} as const;

export const authPath = {
  root: undefined,
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyAccount: '/verify-account',
} as const;

export const loginRoute = {
  id: authId.login,
  path: authPath.login,
  lazy: async () => {
    const login = await import('./pages/login.page');

    return {
      action: login.action,
      loader: login.loader,
      element: <login.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} as const satisfies RouteObject;

export const registerRoute = {
  id: authId.register,
  path: authPath.register,
  lazy: async () => {
    const register = await import('./pages/register.page');

    return {
      action: register.action,
      loader: register.loader,
      element: <register.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} as const satisfies RouteObject;

export const verifyAccountRoute = {
  id: authId.verifyAccount,
  path: authPath.verifyAccount,
  lazy: async () => {
    const verifyAccount = await import('./pages/verify-account.page');

    return {
      action: verifyAccount.action,
      loader: verifyAccount.loader,
      element: <verifyAccount.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} as const satisfies RouteObject;

/**
 * should be last route
 */
export const notFoundRoute = {
  id: 'notFound',
  path: '*',
  lazy: async () => {
    const notFound = await import('./pages/not-found.page');

    return { element: <notFound.Element /> };
  },
} as const satisfies RouteObject;
