import { z } from '@app/lib/vi-zod';
import { createGenericStore } from '@shared/hooks/use-store';

const emailSchema = z
  .object({
    email: z.string().email(),
    target: z.enum(['verify-account', 'forgot-password']),
    status: z.enum(['code-sent', 'code-verified']),
  })
  .nullable();

export type useEmailStore = z.infer<typeof emailSchema>;

export const {
  useStore: useEmailStore,
  storeSchema: emailStoreSchema,
  localStorageSchema: emailLocalStorageSchema,
} = createGenericStore<typeof emailSchema>(
  'app-email-store',
  emailSchema,
  1, // version
);
