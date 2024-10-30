import { houseInStoreSchema } from '@modules/auth/schemas/auth.schema';
import { createGenericStore } from '@shared/hooks/use-store';
import type { z } from 'zod';

const houseSchema = houseInStoreSchema;

export type useHouseStore = z.infer<typeof houseSchema>;

export const {
  useStore: useHouseStore,
  storeSchema: houseStoreSchema,
  localStorageSchema: houseLocalStorageSchema,
} = createGenericStore<typeof houseSchema>(
  'app-house-selected-store',
  houseSchema,
  1, // version
);
