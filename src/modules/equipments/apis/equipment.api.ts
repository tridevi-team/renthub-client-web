import type { QueryOptions } from '@app/types';
import type {
  EquipmentCreateResponseSchema,
  EquipmentDeleteResponseSchema,
  EquipmentDetailResponseSchema,
  EquipmentIndexResponseSchema,
  EquipmentUpdateResponseSchema,
  EquipmentUpdateStatusResponseSchema,
} from '@modules/equipments/schema/equiment.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const equipmentRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`equipment/${houseId}/search`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<EquipmentIndexResponseSchema>();

    return resp;
  },
  create: async ({ equipment }: { equipment: any }) => {
    const houseId = getHouseSelected()?.id;
    for (const key in equipment)
      if (!equipment[key] && equipment[key] !== 0) delete equipment[key];
    const resp = await http.instance
      .post(`equipment/${houseId}/add`, {
        json: equipment,
      })
      .json<EquipmentCreateResponseSchema>();

    return resp;
  },
  detail: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .get(`equipment/${id}/details`)
      .json<EquipmentDetailResponseSchema>();

    return resp;
  },
  update: async ({ id, equipment }: { id: string; equipment: any }) => {
    const resp = await http.instance
      .put(`equipment/${id}/update`, {
        json: equipment,
      })
      .json<EquipmentUpdateResponseSchema>();

    return resp;
  },
  updateStatus: async ({
    id,
    status,
    sharedType,
  }: { id: string; status: string; sharedType: string }) => {
    const resp = await http.instance
      .put(`equipment/${id}/update-status`, {
        json: { status, sharedType },
      })
      .json<EquipmentUpdateStatusResponseSchema>();

    return resp;
  },
  delete: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .delete(`equipment/${id}/delete`)
      .json<EquipmentDeleteResponseSchema>();
    return resp;
  },
  deleteMany: async ({ ids }: { ids: string[] }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .delete(`equipment/${houseId}/delete-in-house`, {
        json: { ids },
      })
      .json();

    return resp;
  },
};
