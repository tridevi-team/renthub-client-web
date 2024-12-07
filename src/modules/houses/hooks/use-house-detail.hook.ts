import { houseRepositories } from '@modules/houses/apis/house.api';
import { houseKeys } from '@modules/houses/schema/house.schema';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import type { QueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Except } from 'type-fest';

type Params = Parameters<typeof houseKeys.detail>[0];
type Response = Awaited<ReturnType<typeof houseRepositories.detail>>;

/**
 * @url GET ${env.apiBaseUrl}/todos/${id}
 * @note includes error handling in "effect" for convenience
 */
export function useHouseDetail(
  id?: Params,
  options?: Except<
    QueryOptions<Response, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >,
) {
  const [t] = useI18n();
  const queryKey = houseKeys.detail(id);
  const queryFn = async () => {
    if (!id) {
      toast.error(t('ID_REQUIRED'));
      return Promise.reject(new Error(t('ID_REQUIRED')));
    }
    try {
      return await houseRepositories.detail(id);
    } catch (error) {
      toast.error(t('NOT_FOUND'));
      return Promise.reject(error);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn,
    retry: 0,
    enabled: !!id,
    throwOnError() {
      return false;
    },
    ...(options && options),
  });

  return query;
}
