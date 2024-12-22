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
  create: async ({ roomId, data }: { roomId: string; data: any }) => {
    const resp = await http.instance
      .post(`renters/${roomId}/add`, {
        json: data,
      })
      .json<any>();

    return resp;
  },
  getRenterByRoom: async ({ roomId }: { roomId: string }) => {
    const resp = await http.instance
      .get(`renters/rooms/${roomId}/search`, {
        searchParams: http._makeQuery({
          page: -1,
          pageSize: -1,
        }),
      })
      .json<any>();

    return resp;
  },
};
