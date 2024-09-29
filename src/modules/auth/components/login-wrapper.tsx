import LoginLayout from '@modules/auth/components/login-layout';
import { RouterProvider as RACRouterProvider } from 'react-aria-components';
import {
  Outlet,
  useHref,
  useNavigate,
  type NavigateOptions,
} from 'react-router-dom';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

/**
 * page wrapper for router nested layout
 *
 * RAC such as Link, Menu, Tabs, Table, and many others support rendering elements as links that perform navigation when the user interacts with them.
 * It needs to be wrapped by RAC RouterProvider component.
 */
export function LoginWrapper() {
  const navigate = useNavigate();

  return (
    <RACRouterProvider navigate={navigate} useHref={useHref}>
      <LoginLayout>
        <Outlet />
      </LoginLayout>
    </RACRouterProvider>
  );
}
