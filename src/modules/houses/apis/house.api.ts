import type { QueryOptions } from '@app/types';
import {
  type HouseCreateRequestSchema,
  type HouseCreateResponseSchema,
  houseCreateResponseSchema,
  type HouseDeleteRequestSchema,
  houseDeleteResponseSchema,
  type HouseDeleteResponseSchema,
  type HouseDetailRequestSchema,
  houseDetailResponseSchema,
  type HouseDetailResponseSchema,
  houseIndexResponseSchema,
  type HouseIndexResponseSchema,
  type HouseUpdateRequestSchema,
  houseUpdateResponseSchema,
  type HouseUpdateResponseSchema,
  type HouseUpdateStatusRequestSchema,
  houseUpdateStatusResponseSchema,
  type HouseUpdateStatusResponseSchema,
} from '@modules/houses/schema/house.schema';
import { http } from '@shared/services/http.service';

export const houseRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const resp = await http.instance
      .get('houses/list', {
        searchParams: http._makeQuery(searchParams),
      })
      .json<HouseIndexResponseSchema>();

    return houseIndexResponseSchema.parse(resp);
  },
  create: async (house: HouseCreateRequestSchema) => {
    const { street, ward, district, city, ...rest } = house;
    const resp = await http.instance
      .post('houses/create', {
        json: {
          address: { street, ward, district, city },
          ...rest,
        },
      })
      .json<HouseCreateResponseSchema>();

    return houseCreateResponseSchema.parse(resp);
  },
  detail: async (id: HouseDetailRequestSchema) => {
    const resp = await http.instance
      .get(`houses/${id}/details`)
      .json<HouseDetailResponseSchema>();

    return houseDetailResponseSchema.parse(resp);
  },
  update: async (house: HouseUpdateRequestSchema) => {
    const { id, street, ward, district, city, ...rest } = house;
    if (!id) return Promise.reject('Missing house id');
    const resp = await http.instance
      .put(`houses/${house.id}/update`, {
        json: {
          address: { street, ward, district, city },
          ...rest,
        },
      })
      .json<HouseUpdateResponseSchema>();

    return houseUpdateResponseSchema.parse(resp);
  },
  delete: async (id: HouseDeleteRequestSchema) => {
    const resp = await http.instance
      .delete(`houses/${id}/delete`)
      .json<HouseDeleteResponseSchema>();

    return houseDeleteResponseSchema.parse(resp);
  },
  changeStatus: async ({ ids, status }: HouseUpdateStatusRequestSchema) => {
    const resp = await http.instance
      .patch('houses/update-status', {
        json: {
          ids,
          status: status ? 1 : 0,
        },
      })
      .json<HouseUpdateStatusResponseSchema>();

    return houseUpdateStatusResponseSchema.parse(resp);
  },
};
