import { z } from '@app/lib/vi-zod';

export const house = z.object({
  id: z.string(),
  name: z.string(),
  address: z.object({
    city: z.string(),
    ward: z.string(),
    street: z.string(),
    district: z.string(),
  }),
  contractDefault: z.unknown(),
  description: z.string().nullable(),
  collectionCycle: z.number(),
  invoiceDate: z.number(),
  numCollectDays: z.number(),
  status: z.number(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedBy: z.string(),
  updatedAt: z.string(),
});

export const houseIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z
    .object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
      results: z.array(house),
    })
    .nullable(),
});

export type HouseSchema = z.infer<typeof house>;
export type HouseIndexResponseSchema = z.infer<typeof houseIndexResponseSchema>;
