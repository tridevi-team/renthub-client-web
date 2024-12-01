import { z } from '@app/lib/vi-zod';

export const user = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  fullName: z.string(),
  gender: z.string(),
  phoneNumber: z.string(),
  address: z
    .object({
      city: z.string().nullable(),
      district: z.string().nullable(),
      ward: z.string().nullable(),
      street: z.string().nullable(),
    })
    .nullable(),
  birthday: z.string(),
  role: z.string(),
  type: z.string(),
  status: z.number(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string(),
});

export const userData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(user),
  })
  .nullable();

export const userIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: userData,
});

export type UserSchema = z.infer<typeof user>;
export type UserDataSchema = z.infer<typeof userData>;
export type UserIndexResponseSchema = z.infer<typeof userIndexResponseSchema>;

export const userKeys = {
  all: ['users'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...userKeys.all, 'list', ...(params ? [params] : [])] as const,
};
