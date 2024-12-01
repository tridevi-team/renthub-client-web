import { houseRepositories } from '@modules/houses/apis/house.api';
import { houseKeys } from '@modules/houses/schema/house.schema';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { isErrorResponseSchema } from '@shared/utils/type-guards';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { toast } from 'sonner';
import type { Except } from 'type-fest';
import type { ZodError } from 'zod';

type Params = Parameters<typeof houseKeys.delete>[0];
type Success = Awaited<ReturnType<typeof houseRepositories.delete>>;
type Error = ErrorResponseSchema | HTTPError | ZodError;

/**
 * @url POST ${env.apiBaseUrl}/todos
 * @note includes error handling & `houseKeys.all` key invalidation for convenience
 */
export function useHouseDelete(
  params?: Params,
  mutationOptions?: Except<
    UseMutationOptions<Success, Error, Exclude<Params, undefined>>,
    'mutationKey' | 'mutationFn'
  >,
) {
  const { onSuccess, onError, ..._mutationOptions } = mutationOptions ?? {};
  const queryClient = useQueryClient();
  const [t] = useI18n();

  return useMutation<Success, Error, Exclude<Params, undefined>>({
    mutationKey: houseKeys.delete(params),
    mutationFn: (params) => houseRepositories.delete(params),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: houseKeys.all,
      });
      toast.success(t('ms_delete_house_success'));

      onSuccess?.(data, variables, context);
    },
    onError: async (error, variables, context) => {
      if (isErrorResponseSchema(error)) {
        toast.error(error.code);
      }

      onError?.(error, variables, context);
    },
    ..._mutationOptions,
  });
}
