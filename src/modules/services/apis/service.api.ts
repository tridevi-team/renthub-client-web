import type { QueryOptions } from '@app/types';
import type {
  ServiceAddManyToRoomRequestSchema,
  ServiceAddManyToRoomResponseSchema,
  ServiceAddToRoomRequestSchema,
  ServiceAddToRoomResponseSchema,
  ServiceCreateRequestSchema,
  ServiceCreateResponseSchema,
  ServiceDeleteResponseSchema,
  ServiceDetailResponseSchema,
  ServiceIndexResponseSchema,
  ServiceRemoveServiceFromRoomRequestSchema,
  ServiceRemoveServiceFromRoomResponseSchema,
  ServiceUpdateRequestSchema,
  ServiceUpdateResponseSchema,
} from '@modules/services/schemas/service.schema';
import { SERVICE_TYPES, TYPE_INDEX } from '@shared/constants/general.constant';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const serviceRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`services/${houseId}/search`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<ServiceIndexResponseSchema>();

    return resp;
  },
  create: async ({ service }: { service: ServiceCreateRequestSchema }) => {
    const houseId = getHouseSelected()?.id;
    let { type, typeIndex } = service;
    if (type === SERVICE_TYPES.INDEX) {
      if (typeIndex === TYPE_INDEX.ELECTRICITY_CONSUMPTION)
        type = SERVICE_TYPES.ELECTRICITY_CONSUMPTION;
      if (typeIndex === TYPE_INDEX.WATER_CONSUMPTION)
        type = SERVICE_TYPES.WATER_CONSUMPTION;
    }
    for (const key in service)
      if (!(service as any)[key]) delete (service as any)[key];
    const resp = await http.instance
      .post(`services/${houseId}/create`, {
        json: {
          ...service,
          type,
        },
      })
      .json<ServiceCreateResponseSchema>();

    return resp;
  },
  detail: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .get(`services/${id}/details`)
      .json<ServiceDetailResponseSchema>();

    return resp;
  },
  update: async ({
    id,
    service,
  }: { id: string; service: ServiceUpdateRequestSchema }) => {
    let { type, typeIndex } = service;
    if (type === SERVICE_TYPES.INDEX) {
      if (typeIndex === TYPE_INDEX.ELECTRICITY_CONSUMPTION)
        type = SERVICE_TYPES.ELECTRICITY_CONSUMPTION;
      if (typeIndex === TYPE_INDEX.WATER_CONSUMPTION)
        type = SERVICE_TYPES.WATER_CONSUMPTION;
    }
    for (const key in service)
      if (!(service as any)[key]) delete (service as any)[key];
    const resp = await http.instance
      .put(`services/${id}/update`, {
        json: {
          ...service,
          type,
        },
      })
      .json<ServiceUpdateResponseSchema>();

    return resp;
  },
  delete: async ({ id }: { id: string }) => {
    const resp = await http.instance
      .delete(`services/${id}/delete`)
      .json<ServiceDeleteResponseSchema>();

    return resp;
  },
  addServiceToRoom: async ({
    roomId,
    services,
  }: ServiceAddToRoomRequestSchema) => {
    const resp = await http.instance
      .post(`services/${roomId}/add-to-room`, {
        json: { services },
      })
      .json<ServiceAddToRoomResponseSchema>();

    return resp;
  },
  addManyServiceToRoom: async ({
    ids,
    services,
  }: ServiceAddManyToRoomRequestSchema) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .post(`${houseId}/add-to-rooms`, {
        json: { ids, services },
      })
      .json<ServiceAddManyToRoomResponseSchema>();

    return resp;
  },
  removeServiceFromRoom: async ({
    roomId,
    serviceIds,
  }: ServiceRemoveServiceFromRoomRequestSchema) => {
    const resp = await http.instance
      .delete(`services/${roomId}/delete-room-service`, {
        json: { serviceIds },
      })
      .json<ServiceRemoveServiceFromRoomResponseSchema>();

    return resp;
  },
};
