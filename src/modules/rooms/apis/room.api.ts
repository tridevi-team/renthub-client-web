import type { QueryOptions } from '@app/types';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const roomRepositories = {
  index: async ({
    floorId,
    searchParams,
    isSelect = false,
  }: { floorId: string; searchParams: QueryOptions; isSelect?: boolean }) => {
    const resp = await http.instance
      .get(`floors/${floorId}/rooms`, {
        searchParams: http._makeQuery(searchParams, isSelect),
      })
      .json<any>();

    return resp;
  },
  all: async ({
    searchParams,
    isSelect = false,
  }: { searchParams: QueryOptions; isSelect: boolean }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`houses/${houseId}/rooms`, {
        searchParams: http._makeQuery(searchParams, isSelect),
      })
      .json<any>();

    return resp;
  },
  create: async ({ data }: { data: any }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .post(`rooms/${houseId}/create`, {
        json: data,
      })
      .json<any>();

    return resp;
  },
  update: async ({ id, data }: { id: string; data: any }) => {
    const resp = await http.instance
      .put(`rooms/${id}/update`, {
        json: data,
      })
      .json<any>();

    return resp;
  },
  detail: async ({ id }: { id: string }) => {
    const resp = await http.instance.get(`rooms/${id}/details`).json<any>();

    return resp;
  },
  deleteMany: async ({ ids }: { ids: string[] }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .delete(`rooms/${houseId}/delete-rooms`, {
        json: {
          ids,
        },
      })
      .json<any>();

    return resp;
  },
  latestServices: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .get(`rooms/${id}/latest-services`)
      .json<any>();

    return resp;
  },
  getRoomNotHasBill: async ({
    month,
    year,
  }: { month: number; year: number }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`houses/${houseId}/room-create-bill`, {
        searchParams: {
          page: -1,
          pageSize: -1,
          month,
          year,
        },
      })
      .json<any>();

    return resp;
  },
};
