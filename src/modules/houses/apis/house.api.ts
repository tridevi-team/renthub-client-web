import type { QueryOptions } from '@app/types';
import {
  type HouseCreateRequestSchema,
  type HouseCreateResponseSchema,
  houseCreateResponseSchema,
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
    const resp = await http.instance
      .post('houses/create', { json: house })
      .json<HouseCreateResponseSchema>();

    return houseCreateResponseSchema.parse(resp);
  },
};
