import type { QueryOptions } from '@app/types';
import {
  type FloorCreateRequestSchema,
  floorCreateResponseSchema,
  type FloorCreateResponseSchema,
  type FloorDeleteRequestSchema,
  floorDeleteResponseSchema,
  type FloorDeleteResponseSchema,
  floorDetailResponseSchema,
  type FloorDetailResponseSchema,
  floorIndexResponseSchema,
  type FloorIndexResponseSchema,
  type FloorUpdateRequestSchema,
  type FloorUpdateResponseSchema,
  floorUpdateResponseSchema,
} from '@modules/floors/schema/floor.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const floorRepositories = {
  index: async ({
    searchParams,
    isSelect = false,
  }: { searchParams: QueryOptions; isSelect?: boolean }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`floors/${houseId}/list`, {
        searchParams: http._makeQuery(searchParams, isSelect),
      })
      .json<FloorIndexResponseSchema>();

    return floorIndexResponseSchema.parse(resp);
  },
  create: async ({ floor }: { floor: FloorCreateRequestSchema }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .post(`floors/${houseId}/create`, {
        json: {
          ...floor,
          houseId,
        },
      })
      .json<FloorCreateResponseSchema>();

    return floorCreateResponseSchema.parse(resp);
  },
  detail: async ({ id }: { id: FloorDeleteRequestSchema }) => {
    const resp = await http.instance
      .get(`floors/${id}/details`)
      .json<FloorDetailResponseSchema>();

    return floorDetailResponseSchema.parse(resp);
  },
  update: async ({
    id,
    floor,
  }: { id: string; floor: FloorUpdateRequestSchema }) => {
    const resp = await http.instance
      .put(`floors/${id}/update`, {
        json: floor,
      })
      .json<FloorUpdateResponseSchema>();

    return floorUpdateResponseSchema.parse(resp);
  },
  delete: async ({ id }: { id: FloorDeleteRequestSchema }) => {
    const resp = await http.instance
      .delete(`floors/${id}/delete`)
      .json<FloorDeleteResponseSchema>();

    return floorDeleteResponseSchema.parse(resp);
  },
  deleteMany: async ({ ids }: { ids: string[] }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .delete(`floors/${houseId}/delete-floors`, {
        json: {
          ids,
        },
      })
      .json<FloorDeleteResponseSchema>();

    return floorDeleteResponseSchema.parse(resp);
  },
};
