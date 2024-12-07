import { z } from '@app/lib/vi-zod';
import { appUserStoreSchema } from '@modules/auth/schemas/auth.schema';

/**
 * Use zod-i18n by refine
 * .refine(() => false, {
 *   params: {
 *    i18n: {
 *     key: 'vld_invalidType',
 *    values: { field: 'Username' },
 *  },
 * }
 */

export const authLoginRequestSchema = z.object({
  username: z.string().email().trim().min(1),
  password: z.string().trim().min(1),
});

export const authLoginResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: appUserStoreSchema,
});

export type AuthLoginRequestSchema = z.infer<typeof authLoginRequestSchema>;
export type AuthLoginResponseSchema = z.infer<typeof authLoginResponseSchema>;
