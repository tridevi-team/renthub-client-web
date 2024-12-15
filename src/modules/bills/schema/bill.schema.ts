import { z } from '@app/lib/vi-zod';

export const bill = z.object({
  id: z.string(),
  roomId: z.string(),
  roomName: z.string(),
  title: z.string(),
  amount: z.number(),
  date: z.object({
    from: z.string(),
    to: z.string(),
  }),
  paymentDate: z.string().nullable(),
  status: z.string(),
  description: z.string().nullable(),
  accountName: z.string(),
  accountNumber: z.string(),
  bankName: z.string(),
  services: z.array(
    z.object({
      serviceId: z.string().nullable(),
      name: z.string(),
      oldValue: z.string().nullable(),
      newValue: z.string().nullable(),
      amount: z.number(),
      unitPrice: z.number(),
      totalPrice: z.number(),
      description: z.string().nullable(),
    }),
  ),
});

export const billData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(bill),
  })
  .nullable();

export const billIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: billData,
});

export const billDetailRequestSchema = z.string();

export const billDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: bill,
});

export const billCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export type BillSchema = z.infer<typeof bill>;
export type BillDataSchema = z.infer<typeof billData>;
export type BillIndexResponseSchema = z.infer<typeof billIndexResponseSchema>;
export type BillCreateResponseSchema = z.infer<typeof billCreateResponseSchema>;

export const billKeys = {
  all: ['bills'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...billKeys.all, 'list', ...(params ? [params] : [])] as const,
};
