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

export const authRegisterRequestSchema = z
  .object({
    email: z.string().email().min(1),
    fullName: z.string().trim().min(1).max(255),
    gender: z.enum(['male', 'female', '']),
    phoneNumber: z
      .string()
      .trim()
      .refine((phoneNumber) => /^[0-9]{10}$/.test(phoneNumber), {
        params: {
          i18n: {
            key: 'vld_phoneNumber',
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

export const authRegisterResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const authVerifyEmailRequestSchema = z.object({
  email: z.string().email().min(1),
  verifyCode: z
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
});

export const authVerifyEmailResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
});

export const authResendCodeRequestSchema = z.object({
  email: z.string().email().min(1),
});

export const authResendCodeResponseSchema = z.object({
  success: z.literal(true),
  code: z.string(),
  message: z.string(),
});

export type AuthRegisterRequestSchema = z.infer<
  typeof authRegisterRequestSchema
>;
export type AuthRegisterResponseSchema = z.infer<
  typeof authRegisterResponseSchema
>;

export type AuthVerifyEmailRequestSchema = z.infer<
  typeof authVerifyEmailRequestSchema
>;
export type AuthVerifyEmailResponseSchema = z.infer<
  typeof authVerifyEmailResponseSchema
>;

export type AuthResendCodeRequestSchema = z.infer<
  typeof authResendCodeRequestSchema
>;
export type AuthResendCodeResponseSchema = z.infer<
  typeof authResendCodeResponseSchema
>;
