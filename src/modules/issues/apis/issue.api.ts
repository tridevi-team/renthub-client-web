import type { QueryOptions } from '@app/types';
import type {
  IssueDeleteManyRequestSchema,
  IssueDeleteManyResponseSchema,
  IssueDeleteRequestSchema,
  IssueDeleteResponseSchema,
  IssueDetailRequestSchema,
  IssueDetailResponseSchema,
  IssueIndexResponseSchema,
} from '@modules/issues/schema/issue.schema';
import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export const issueRepositories = {
  index: async ({ searchParams }: { searchParams: QueryOptions }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`issues/${houseId}/search`, {
        searchParams: http._makeQuery(searchParams),
      })
      .json<IssueIndexResponseSchema>();

    return resp;
  },
  detail: async ({ id }: { id: IssueDetailRequestSchema }) => {
    const resp = await http.instance
      .get(`issues/${id}/details`)
      .json<IssueDetailResponseSchema>();

    return resp;
  },
  delete: async ({ id }: { id: IssueDeleteRequestSchema }) => {
    const resp = await http.instance
      .delete(`issues/${id}/delete`)
      .json<IssueDeleteResponseSchema>();

    return resp;
  },
  deleteMany: async ({ ids }: { ids: IssueDeleteManyRequestSchema }) => {
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .delete(`issues/${houseId}/delete-issues`, {
        json: ids,
      })
      .json<IssueDeleteManyResponseSchema>();

    return resp;
  },
};
