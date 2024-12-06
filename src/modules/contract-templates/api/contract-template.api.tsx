import type { QueryOptions } from '@app/types';
import type {
  ContractTemplateCreateRequestSchema,
  ContractTemplateCreateResponseSchema,
  ContractTemplateDeleteResponseSchema,
  ContractTemplateDetailResponseSchema,
  ContractTemplateIndexResponseSchema,
  ContractTemplateUpdateRequestSchema,
  ContractTemplateUpdateResponseSchema,
} from '@modules/contract-templates/schemas/contract-template.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const contractTemplateRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`contracts/${houseId}/contract-templates`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<ContractTemplateIndexResponseSchema>();

    return resp;
  },
  create: async ({
    contractTemplate,
  }: { contractTemplate: ContractTemplateCreateRequestSchema }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .post(`contracts/${houseId}/create-contract-template`, {
        json: contractTemplate,
      })
      .json<ContractTemplateCreateResponseSchema>();

    return resp;
  },
  update: async ({
    contractTemplate,
    id,
  }: { contractTemplate: ContractTemplateUpdateRequestSchema; id: string }) => {
    const resp = await http.instance
      .patch(`contracts/${id}/update-contract-template`, {
        json: contractTemplate,
      })
      .json<ContractTemplateUpdateResponseSchema>();

    return resp;
  },
  delete: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .delete(`contracts/${id}/delete-contract-templates`)
      .json<ContractTemplateDeleteResponseSchema>();

    return resp;
  },
  getKeyReplaces: async () => {
    const resp = await http.instance.get('contracts/key-replace').json<{
      data: { key: string; label: string }[];
    }>();

    return resp?.data;
  },
  detail: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .get(`contracts/${id}/template-details`)
      .json<ContractTemplateDetailResponseSchema>();

    return resp;
  },
};
