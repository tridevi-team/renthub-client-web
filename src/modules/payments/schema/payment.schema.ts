import { z } from '@app/lib/vi-zod';

export const paymentMethod = z.object({
  id: z.string(),
  houseId: z.string().nullable(),
  name: z.string(),
  accountNumber: z.string(),
  bankName: z.string(),
  status: z.number(),
  description: z.string().nullable(),
  isDefault: z.number(),
  payosClientId: z.string().nullable(),
  payosApiKey: z.string().nullable(),
  payosChecksum: z.string().nullable(),
  createdBy: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const paymentMethodData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(paymentMethod),
  })
  .nullable();

export const paymentMethodIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: paymentMethodData,
});

export const paymentMethodDetailRequestSchema = z.string();

export const paymentMethodDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: paymentMethod,
});

export const paymentMethodCreateRequestSchema = z.object({
  name: z.string().trim().min(1),
  accountNumber: z.string().trim().min(1),
  bankName: z.string().trim().min(1),
  status: z.number().or(z.boolean()).nullable().optional(),
  description: z.string().nullable().optional(),
  isDefault: z.number().or(z.boolean()).nullable().optional(),
  payosClientId: z.string().nullable().optional(),
  payosApiKey: z.string().nullable().optional(),
  payosChecksum: z.string().nullable().optional(),
});

export const paymentMethodCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const paymentMethodUpdateRequestSchema = z.object({
  name: z.string().trim().min(1),
  accountNumber: z.string().trim().min(1),
  bankName: z.string().trim().min(1),
  status: z.number().or(z.boolean()).nullable().optional(),
  description: z.string().nullable().optional(),
  isDefault: z.number().or(z.boolean()).nullable().optional(),
  payosClientId: z.string().nullable().optional(),
  payosApiKey: z.string().nullable().optional(),
  payosChecksum: z.string().nullable().optional(),
});

export const paymentMethodUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const paymentMethodDeleteRequestSchema = z.string();

export const paymentMethodDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type PaymentMethodSchema = z.infer<typeof paymentMethod>;
export type PaymentMethodDataSchema = z.infer<typeof paymentMethodData>;
export type PaymentMethodIndexResponseSchema = z.infer<
  typeof paymentMethodIndexResponseSchema
>;
export type PaymentMethodDetailRequestSchema = z.infer<
  typeof paymentMethodDetailRequestSchema
>;
export type PaymentMethodDetailResponseSchema = z.infer<
  typeof paymentMethodDetailResponseSchema
>;
export type PaymentMethodCreateRequestSchema = z.infer<
  typeof paymentMethodCreateRequestSchema
>;
export type PaymentMethodCreateResponseSchema = z.infer<
  typeof paymentMethodCreateResponseSchema
>;
export type PaymentMethodUpdateRequestSchema = z.infer<
  typeof paymentMethodUpdateRequestSchema
>;
export type PaymentMethodUpdateResponseSchema = z.infer<
  typeof paymentMethodUpdateResponseSchema
>;
export type PaymentMethodDeleteRequestSchema = z.infer<
  typeof paymentMethodDeleteRequestSchema
>;
export type PaymentMethodDeleteResponseSchema = z.infer<
  typeof paymentMethodDeleteResponseSchema
>;

export const paymentMethodKeys = {
  all: ['paymentMethods'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...paymentMethodKeys.all, 'list', ...(params ? [params] : [])] as const,
};
