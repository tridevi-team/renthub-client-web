import { houseRepositories } from '@modules/houses/apis/house.api';
import { houseKeys } from '@modules/houses/schema/house.schema';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import type { QueryOptions } from '@tanstack/react-query';
import { skipToken, useQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import type { Except } from 'type-fest';

type Params = Parameters<typeof houseKeys.detail>[0];
type Response = Awaited<ReturnType<typeof houseRepositories.detail>>;

/**
 * @url GET ${env.apiBaseUrl}/todos/${id}
 * @note includes error handling in "effect" for convenience
 */
export function useTodoDetail(
  id?: Params,
  options?: Except<
    QueryOptions<Response, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryKey = houseKeys.detail(id);
  const queryFn = id ? () => houseRepositories.detail(id) : skipToken;

  const query = useQuery({
    queryKey,
    queryFn,
    ...(options && options),
  });

  React.useEffect(() => {
    if (query.error) {
      toast.error(query.error.message);
    }
  }, [query.error]);

  return query;
}
