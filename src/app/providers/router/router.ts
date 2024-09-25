import { loginRoute, notFoundRoute, registerRoute } from '@auth/routes';
import { dashboardRoute } from '@modules/dashboard/routes';
import { createBrowserRouter } from 'react-router-dom';

// router singleton
export const browserRouter = createBrowserRouter(
  [dashboardRoute, loginRoute, notFoundRoute, registerRoute],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  },
);
