import {
  authLoginRoute,
  authRegisterRoute,
  notFoundRoute,
  notPermissionRoute,
} from '@auth/routes';
import { dashboardRoute } from '@modules/dashboard/routes';
import { floorRoute } from '@modules/floors/routes';
import { houseRoute } from '@modules/houses/routes';
import { createBrowserRouter } from 'react-router-dom';

// router singleton
export const browserRouter = createBrowserRouter(
  [
    authLoginRoute,
    authRegisterRoute,
    dashboardRoute,
    houseRoute,
    floorRoute,
    notFoundRoute,
    notPermissionRoute,
  ],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  },
);
