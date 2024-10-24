import type { QueryOptions } from '@app/types';
import {
  type HouseCreateRequestSchema,
  type HouseCreateResponseSchema,
  houseCreateResponseSchema,
  type HouseDetailRequestSchema,
  houseDetailResponseSchema,
  type HouseDetailResponseSchema,
  houseIndexResponseSchema,
  type HouseIndexResponseSchema,
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
};
