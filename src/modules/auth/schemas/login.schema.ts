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
  username: z
    .string()
    .refine((v) => v.length > 0, {
      params: {
        i18n: {
          key: 'vld_required',
          values: { field: 'Tên đăng nhập' },
        },
      },
    })
    .refine((v) => !/\s/.test(v), {
      params: {
        i18n: {
          key: 'vld_required',
          values: { field: 'Tên đăng nhập' },
        },
      },
    })
    .refine((v) => v.length <= 255, {
      params: {
        i18n: {
          key: 'vld_maxLength',
          values: { field: 'Tên đăng nhập', max: 255 },
        },
      },
    })
    .refine(
      (v) => {
        if (v.includes('@')) {
          return z.string().email().safeParse(v).success;
        }
        return z.string().length(10).safeParse(v).success;
      },
      {
        params: {
          i18n: {
            key: 'vld_invalidType',
            values: { field: 'Tên đăng nhập' },
          },
        },
      },
    ),
  password: z
    .string()
    .refine((v) => v.length > 0, {
      params: {
        i18n: {
          key: 'vld_required',
          values: { field: 'Mật khẩu' },
        },
      },
    })
    .refine((v) => v.length <= 255, {
      params: {
        i18n: {
          key: 'vld_maxLength',
          values: { field: 'Mật khẩu', max: 255 },
        },
      },
    })
    .refine((v) => !/\s/.test(v), {
      params: {
        i18n: {
          key: 'vld_required',
          values: { field: 'Mật khẩu' },
        },
      },
    })
    .refine((v) => v.length >= 6, {
      params: {
        i18n: {
          key: 'vld_minLength',
          values: { field: 'Mật khẩu', min: 6 },
        },
      },
    }),
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
