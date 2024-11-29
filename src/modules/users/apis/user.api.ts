import type { QueryOptions } from '@app/types';
import {
  userIndexResponseSchema,
  type UserIndexResponseSchema,
} from '@modules/users/schema/user.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

const prefix = 'users';

export const userRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`${prefix}/get-users-by-house/${houseId}`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<UserIndexResponseSchema>();

    return userIndexResponseSchema.parse(resp);
  },
};
