import { z } from '@app/lib/vi-zod';

export const PERMISSION_KEY = [
  'house',
  'floor',
  'role',
  'room',
  'renter',
  'service',
  'bill',
  'equipment',
  'payment',
  'notification',
  'issue',
  'contract',
] as const;

export type PermissionKeyType = (typeof PERMISSION_KEY)[number];

export const CRUDPermissionSchema = z.object({
  create: z.boolean(),
  read: z.boolean(),
  update: z.boolean(),
  delete: z.boolean(),
});

export const houseInStoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.object({
    city: z.string(),
    district: z.string(),
    ward: z.string(),
    street: z.string(),
  }),
  permissions: z.record(z.enum(PERMISSION_KEY), CRUDPermissionSchema),
});

export const appUserStoreSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    fullName: z.string(),
    role: z.string(),
    type: z.string(),
    status: z.number(),
    verify: z.number(),
    accessToken: z.string(),
    houses: z.array(houseInStoreSchema),
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

export const userInfoResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    email: z.string(),
    password: z.string(),
    fullName: z.string(),
    gender: z.string(),
    phoneNumber: z.string(),
    address: z
      .object({
        city: z.string(),
        district: z.string(),
        ward: z.string(),
        street: z.string(),
      })
      .nullable(),
    birthday: z.string(),
    role: z.string(),
    type: z.string(),
    status: z.number(),
    verify: z.number(),
    firstLogin: z.number(),
    createdAt: z.string(),
    updatedBy: z.string().nullable(),
    updatedAt: z.string(),
  }),
});

export const updateUserInfoRequestSchema = z.object({
  fullName: z.string(),
  phoneNumber: z
    .string()
    .min(1)
    .refine((phoneNumber) => /^0\d{9}$/.test(phoneNumber), {
      params: {
        i18n: {
          key: 'vld_phoneNumber',
        },
      },
    }),
  city: z.string(),
  district: z.string(),
  ward: z.string(),
  street: z.string(),
  birthday: z.date(),
  gender: z.string(),
});

export const updateUserInfoResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const changePasswordRequestSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
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
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu nhập lại không khớp',
        path: ['confirmPassword'],
      });
    }
  });

export const changePasswordResponseSchema = z.object({
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

export type UserInfoResponseSchema = z.infer<typeof userInfoResponseSchema>;
export type UpdateUserInfoRequestSchema = z.infer<
  typeof updateUserInfoRequestSchema
>;
export type UpdateUserInfoResponseSchema = z.infer<
  typeof updateUserInfoResponseSchema
>;

export type ChangePasswordRequestSchema = z.infer<
  typeof changePasswordRequestSchema
>;
export type ChangePasswordResponseSchema = z.infer<
  typeof changePasswordResponseSchema
>;
