import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { PERMISSION_KEY } from '@modules/auth/schemas/auth.schema';
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

type Params = Parameters<typeof houseKeys.create>[0];
type Success = Awaited<ReturnType<typeof houseRepositories.create>>;
type Error = ErrorResponseSchema | HTTPError | ZodError;

/**
 * @url POST ${env.apiBaseUrl}/todos
 * @note includes error handling & `houseKeys.all` key invalidation for convenience
 */
export function useHouseCreate(
  params?: Params,
  mutationOptions?: Except<
    UseMutationOptions<Success, Error, Exclude<Params, undefined>>,
    'mutationKey' | 'mutationFn'
  >,
) {
  const { onSuccess, onError, ..._mutationOptions } = mutationOptions ?? {};
  const queryClient = useQueryClient();
  const [t] = useI18n();

  const addHouseToUserStore = (newHouse: {
    name: string;
    description: string | null;
    collectionCycle: number;
    invoiceDate: number;
    numCollectDays: number;
    status: number;
    id: string;
    address: { city: string; ward: string; street: string; district: string };
    createdBy: string | null;
    createdAt: string | null;
    updatedBy: string | null;
    updatedAt: string | null;
    numOfFloors?: number | null | undefined;
    numOfRoomsPerFloor?: number | null | undefined;
    maxRenters?: number | null | undefined;
    roomArea?: number | null | undefined;
    roomPrice?: number | null | undefined;
    contractDefault?: unknown;
    floors?: unknown[] | undefined;
  }) => {
    const { user, setUser } = useAuthUserStore.getState();
    if (user) {
      const updatedUser = {
        ...user,
        houses: [
          ...user.houses,
          {
            ...newHouse,
            permissions: Object.fromEntries(
              PERMISSION_KEY.map((key) => [
                key,
                { create: true, read: true, update: true, delete: true },
              ]),
            ),
          },
        ],
      };
      setUser(updatedUser);
    }
  };

  return useMutation<Success, Error, Exclude<Params, undefined>>({
    mutationKey: houseKeys.create(params),
    mutationFn: (params) => houseRepositories.create(params),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: houseKeys.all,
      });
      toast.success(t('ms_create_house_success'));
      addHouseToUserStore(data.data);
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
