import {
  authLoginRoute,
  authRegisterRoute,
  notFoundRoute,
  notPermissionRoute,
} from '@auth/routes';
import { contractTemplateRoute } from '@modules/contract-templates/routes';
import { contractRoute } from '@modules/contracts/routes';
import { dashboardRoute } from '@modules/dashboard/routes';
import { equipmentRoute } from '@modules/equipments/routes';
import { floorRoute } from '@modules/floors/routes';
import { houseRoute } from '@modules/houses/routes';
import { issueRoute } from '@modules/issues/routes';
import { renterRoute } from '@modules/renters/routes';
import { roleRoute } from '@modules/roles/routes';
import { roomRoute } from '@modules/rooms/routes';
import { serviceRoute } from '@modules/services/routes';
import { statsRoute } from '@modules/stats/routes';
import { userRoute } from '@modules/users/routes';
import { createBrowserRouter } from 'react-router-dom';

// router singleton
export const browserRouter = createBrowserRouter(
  [
    authLoginRoute,
    authRegisterRoute,
    dashboardRoute,
    houseRoute,
    floorRoute,
    roleRoute,
    notFoundRoute,
    notPermissionRoute,
    userRoute,
    equipmentRoute,
    roomRoute,
    serviceRoute,
    contractTemplateRoute,
    statsRoute,
    renterRoute,
    contractRoute,
    issueRoute,
  ],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  },
);
