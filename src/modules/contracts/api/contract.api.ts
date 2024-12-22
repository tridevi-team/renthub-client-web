import type { QueryOptions } from '@app/types';
import type {
  ContractDeleteResponseSchema,
  ContractDetailRequestSchema,
  ContractDetailResponseSchema,
  ContractIndexResponseSchema,
} from '@modules/contracts/schemas/contract.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const contractRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`contracts/${houseId}/contracts-by-house`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<ContractIndexResponseSchema>();

    return resp;
  },
  detail: async ({ id }: { id: ContractDetailRequestSchema }) => {
    const resp = await http.instance
      .get(`contracts/${id}/contract-details`)
      .json<ContractDetailResponseSchema>();

    return resp;
  },
  delete: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .delete(`contracts/${id}/delete-contract`)
      .json<ContractDeleteResponseSchema>();

    return resp;
  },
  create: async ({ roomId, data }: { roomId: string; data: any }) => {
    const resp = await http.instance
      .post(`contracts/${roomId}/create-contract`, {
        json: data,
      })
      .json();

    return resp;
  },
  updateStatus: async ({ id, data }: { id: string; data: any }) => {
    const resp = await http.instance
      .patch(`contracts/${id}/update-contract-status`, {
        json: data,
      })
      .json();

    return resp;
  },
  extendContract: async ({ id, data }: { id: string; data: any }) => {
    const resp = await http.instance
      .post(`contracts/${id}/extend`, {
        json: data,
      })
      .json();

    return resp;
  },
};
