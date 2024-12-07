import { LoginWrapper } from '@modules/auth/components/login-wrapper';
import { RegisterWrapper } from '@modules/auth/components/register-wrapper';
import { RouteErrorBoundary } from '@shared/components/route-error-boundary';
import type { RouteObject } from 'react-router-dom';

export const authId = {
  root: undefined,
  rootRegister: 'auth',
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
  notPermission: '/not-permission',
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

export const forgotPasswordRoute = {
  id: authId.forgotPassword,
  path: authPath.forgotPassword,
  lazy: async () => {
    const forgotPassword = await import('./pages/forgot-password.page');

    return {
      action: forgotPassword.action,
      loader: forgotPassword.loader,
      element: <forgotPassword.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} as const satisfies RouteObject;

export const resetPasswordRoute = {
  id: authId.resetPassword,
  path: authPath.resetPassword,
  lazy: async () => {
    const resetPassword = await import('./pages/reset-password.page');

    return {
      action: resetPassword.action,
      loader: resetPassword.loader,
      element: <resetPassword.Element />,
      errorElement: <RouteErrorBoundary />,
    };
  },
} as const satisfies RouteObject;

export const authLoginRoute = {
  id: authId.root,
  path: authPath.root,
  element: <LoginWrapper />,
  children: [forgotPasswordRoute, loginRoute, resetPasswordRoute],
} satisfies RouteObject;

export const authRegisterRoute = {
  id: authId.rootRegister,
  path: authPath.root,
  element: <RegisterWrapper />,
  children: [registerRoute, verifyAccountRoute],
} satisfies RouteObject;

/**
 * should be last route
 */
export const notFoundRoute = {
  id: 'notFound',
  path: '*',
  lazy: async () => {
    const notFound = await import('@shared/pages/not-found.page');

    return { element: <notFound.Element /> };
  },
} as const satisfies RouteObject;

export const notPermissionRoute = {
  id: 'notPermission',
  path: '/not-permission',
  lazy: async () => {
    const notPermission = await import('@shared/pages/not-permission.page');

    return { element: <notPermission.Element /> };
  },
} as const satisfies RouteObject;
