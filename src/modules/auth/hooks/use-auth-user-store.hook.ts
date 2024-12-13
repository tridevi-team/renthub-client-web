import { appUserStoreSchema } from '@modules/auth/schemas/auth.schema';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type UserStoreState = z.infer<typeof userStoreStateSchema>;
export type UserStore = z.infer<typeof userStoreSchema>;
export type UserStoreLocalStorage = z.infer<typeof userStoreLocalStorageSchema>;

export const userStoreName = 'app-user' as const;
const userStoreStateSchema = z.object({
  user: appUserStoreSchema.nullable(),
});
const userStoreActionSchema = z.object({
  setUser: z.function().args(appUserStoreSchema).returns(z.void()),
  clearUser: z.function().args(z.void()).returns(z.void()),
  updateAccessToken: z.function().args(z.string()).returns(z.void()),
});
export const userStoreSchema = userStoreStateSchema.merge(
  userStoreActionSchema,
);
export const userStoreLocalStorageSchema = z.object({
  state: userStoreStateSchema,
  version: z.number(),
});

/**
 * Hooks to manipulate user store
 *
 * @example
 *
 * ```tsx
 * const { user, setUser, clearUser } = useUserStore()
 * ```
 */
export const useAuthUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null as z.infer<typeof appUserStoreSchema> | null,
        setUser: (newUser: z.infer<typeof appUserStoreSchema>) => {
          set({ user: newUser });
        },
        clearUser: () => {
          set({ user: null });
        },
        updateAccessToken: (newAccessToken: string) =>
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  accessToken: newAccessToken,
                }
              : null,
          })),
      }),
      {
        name: userStoreName, // name of the item in the storage (must be unique)
        version: 0, // a migration will be triggered if the version in the storage mismatches this one
        storage: createJSONStorage(() => localStorage), // by default, 'localStorage' is used
      },
    ),
  ),
);
