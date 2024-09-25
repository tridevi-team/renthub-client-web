import { z } from '@app/lib/vi-zod';

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
  data: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      fullName: z.string(),
      phoneNumber: z.string(),
      address: z.string(),
      birthday: z.string(),
      role: z.string(),
      type: z.string(),
      status: z.number(),
      verify: z.number(),
    }),
    token: z.string(),
    houses: z.array(z.unknown()),
  }),
});

export type AuthLoginRequestSchema = z.infer<typeof authLoginRequestSchema>;
export type AuthLoginResponseSchema = z.infer<typeof authLoginResponseSchema>;
