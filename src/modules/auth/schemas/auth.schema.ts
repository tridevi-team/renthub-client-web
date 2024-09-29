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

export const authForgotPasswordRequestSchema = z.object({
  email: z.string().trim().email(),
});
export const authForgotPasswordResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const authResetPasswordRequestSchema = z
  .object({
    email: z.string().trim().email(),
    code: z
      .string()
      .trim()
      .refine((verifyCode) => /^[0-9]{4}$/.test(verifyCode), {
        params: {
          i18n: {
            key: 'vld_codeLength',
          },
        },
      })
      .refine((verifyCode) => /^[0-9]+$/.test(verifyCode), {
        params: {
          i18n: {
            key: 'vld_codeRequired',
          },
        },
      }),
    password: z
      .string()
      .trim()
      .min(8)
      .refine(
        (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password),
        {
          params: {
            i18n: {
              key: 'vld_password',
            },
          },
        },
      ),
    confirmPassword: z.string().trim(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu nhập lại không khớp',
        path: ['confirmPassword'],
      });
    }
  });
export const authResetPasswordResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type AppUserStoreSchema = z.infer<typeof appUserStoreSchema>;

export type AuthForgotPasswordRequestSchema = z.infer<
  typeof authForgotPasswordRequestSchema
>;
export type AuthForgotPasswordResponseSchema = z.infer<
  typeof authForgotPasswordResponseSchema
>;

export type AuthResetPasswordRequestSchema = z.infer<
  typeof authResetPasswordRequestSchema
>;
export type AuthResetPasswordResponseSchema = z.infer<
  typeof authResetPasswordResponseSchema
>;
