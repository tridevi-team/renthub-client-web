import type { QueryOptions } from '@app/types';
import type { BillIndexResponseSchema } from '@modules/bills/schema/bill.schema';

import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const billRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`bills/${houseId}/list`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<BillIndexResponseSchema>();

    return resp;
  },
  create: async (data: any) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .post(`bills/${houseId}/create`, {
        json: data,
      })
      .json();

    return resp;
  },
  updateStatus: async (data: { id: string; status: string }[]) => {
    const resp = await http.instance
      .patch('bills/update-status', {
        json: {
          data,
        },
      })
      .json();

    return resp;
  },
};
