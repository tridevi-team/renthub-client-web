import { authLoginRoute, authRegisterRoute, notFoundRoute } from '@auth/routes';
import { dashboardRoute } from '@modules/dashboard/routes';
import { createBrowserRouter } from 'react-router-dom';

// router singleton
export const browserRouter = createBrowserRouter(
  [authLoginRoute, authRegisterRoute, dashboardRoute, notFoundRoute],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  },
);
