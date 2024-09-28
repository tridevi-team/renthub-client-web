import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

type GenericStoreState<T> = {
  data: T | null;
};

type GenericStoreActions<T> = {
  setData: (newData: T) => void;
  clearData: () => void;
};

export type GenericStore<T> = GenericStoreState<T> & GenericStoreActions<T>;

const createGenericStoreSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.nullable(),
    setData: z.function().args(dataSchema).returns(z.void()),
    clearData: z.function().args(z.void()).returns(z.void()),
  });

const createGenericStoreLocalStorageSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    state: z.object({
      data: dataSchema.nullable(),
    }),
    version: z.number(),
  });

export const createGenericStore = <T extends z.ZodTypeAny>(
  name: string,
  dataSchema: T,
  version = 0,
) => {
  const useStore = create<GenericStore<z.infer<T>>>()(
    devtools(
      persist(
        (set) => ({
          data: null,
          setData: (newData) => {
            set({ data: newData });
          },
          clearData: () => {
            set({ data: null });
          },
        }),
        {
          name,
          version,
          storage: createJSONStorage(() => localStorage),
        },
      ),
    ),
  );

  return {
    useStore,
    storeSchema: createGenericStoreSchema(dataSchema),
    localStorageSchema: createGenericStoreLocalStorageSchema(dataSchema),
  };
};
