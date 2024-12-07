import { houseInStoreSchema } from '@modules/auth/schemas/auth.schema';
import { createGenericStore } from '@shared/hooks/use-store';
import type { z } from 'zod';

const houseSchema = houseInStoreSchema.nullable();

export type useHouseStore = z.infer<typeof houseSchema>;
export const useHouseStoreName = 'app-house-selected-store';

export const {
  useStore: useHouseStore,
  storeSchema: houseStoreSchema,
  localStorageSchema: houseLocalStorageSchema,
} = createGenericStore<typeof houseSchema>(
  useHouseStoreName,
  houseSchema,
  1, // version
);
