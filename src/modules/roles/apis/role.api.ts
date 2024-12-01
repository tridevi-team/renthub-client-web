import type { QueryOptions } from '@app/types';
import {
  type RoleCreateRequestSchema,
  roleCreateResponseSchema,
  type RoleCreateResponseSchema,
  type RoleDeleteRequestSchema,
  roleDeleteResponseSchema,
  type RoleDeleteResponseSchema,
  roleDetailResponseSchema,
  type RoleDetailResponseSchema,
  roleIndexResponseSchema,
  type RoleIndexResponseSchema,
  type RoleUpdateRequestSchema,
  type RoleUpdateResponseSchema,
  roleUpdateResponseSchema,
} from '@modules/roles/schema/role.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const roleRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`roles/${houseId}/search`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<RoleIndexResponseSchema>();

    return roleIndexResponseSchema.parse(resp);
  },
  create: async ({ role }: { role: RoleCreateRequestSchema }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .post(`roles/${houseId}/create`, {
        json: {
          ...role,
          status: role.status === 'active',
        },
      })
      .json<RoleCreateResponseSchema>();

    return roleCreateResponseSchema.parse(resp);
  },
  detail: async ({ id }: { id: RoleDeleteRequestSchema }) => {
    const resp = await http.instance
      .get(`roles/${id}/details`)
      .json<RoleDetailResponseSchema>();

    return roleDetailResponseSchema.parse(resp);
  },
  update: async ({
    id,
    role,
  }: { id: string; role: RoleUpdateRequestSchema }) => {
    const resp = await http.instance
      .put(`roles/${id}/update`, {
        json: {
          ...role,
          status: role.status === 'active',
        },
      })
      .json<RoleUpdateResponseSchema>();

    return roleUpdateResponseSchema.parse(resp);
  },
  delete: async ({ id }: { id: RoleDeleteRequestSchema }) => {
    const resp = await http.instance
      .delete(`roles/${id}/delete`)
      .json<RoleDeleteResponseSchema>();

    return roleDeleteResponseSchema.parse(resp);
  },
  deleteMany: async ({ ids }: { ids: string[] }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .delete(`roles/${houseId}/delete-many`, {
        json: { ids },
      })
      .json<RoleDeleteResponseSchema>();

    return roleDeleteResponseSchema.parse(resp);
  },
};
