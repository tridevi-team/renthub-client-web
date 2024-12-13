import type { QueryOptions } from '@app/types';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const notificationRepositories = {
  list: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const resp = await http.instance
      .get('notifications/list', {
        searchParams: http._makeQuery(searchParams),
      })
      .json();
    return resp;
  },
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`houses/${houseId}/revice-information`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json();
    return resp;
  },
  updateStatus: async ({ ids }: { ids: string[] }) => {
    const resp = await http.instance
      .put('notifications/update', {
        json: {
          ids,
          status: 'read',
        },
      })
      .json();
    return resp;
  },
};
