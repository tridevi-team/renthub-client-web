import { z } from '@app/lib/vi-zod';

export const appUserStoreSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    fullName: z.string(),
    role: z.string(),
    type: z.string(),
    status: z.number(),
    verify: z.number(),
    token: z.string(),
    houses: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
      }),
    ),
  })
  .nullable();

export type AppUserStoreSchema = z.infer<typeof appUserStoreSchema>;
