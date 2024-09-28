import { createGenericStore } from '@shared/hooks/use-store';
import { z } from 'zod';

const emailSchema = z
  .object({
    email: z.string().email(),
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
