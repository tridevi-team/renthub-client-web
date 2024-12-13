import type { QueryOptions } from '@app/types';
import type {
  PaymentMethodCreateRequestSchema,
  PaymentMethodCreateResponseSchema,
  PaymentMethodDeleteResponseSchema,
  PaymentMethodIndexResponseSchema,
  PaymentMethodUpdateRequestSchema,
  PaymentMethodUpdateResponseSchema,
} from '@modules/payments/schema/payment.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const paymentRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`payment/${houseId}/search`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<PaymentMethodIndexResponseSchema>();

    return resp;
  },
  create: async (payment: PaymentMethodCreateRequestSchema) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .post(`payment/${houseId}/create`, {
        json: payment,
      })
      .json<PaymentMethodCreateResponseSchema>();

    return resp;
  },
  update: async ({
    id,
    payment,
  }: { id: string; payment: PaymentMethodUpdateRequestSchema }) => {
    const resp = await http.instance
      .put(`payment/${id}/update`, {
        json: payment,
      })
      .json<PaymentMethodUpdateResponseSchema>();

    return resp;
  },
  delete: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .delete(`payment/${id}/delete`)
      .json<PaymentMethodDeleteResponseSchema>();

    return resp;
  },
};
