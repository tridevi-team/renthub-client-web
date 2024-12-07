import type { QueryOptions } from '@app/types';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const renterRepositories = {
  listByHouse: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`renters/houses/${houseId}/search`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<any>();

    return resp;
  },
  detail: async ({ id }: { id: string }) => {
    const resp = await http.instance.get(`renters/${id}/details`).json<any>();

    return resp;
  },
  delete: async ({ id }: { id: string }) => {
    const resp = await http.instance.delete(`renters/${id}/delete`).json<any>();

    return resp;
  },
};
