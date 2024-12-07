import { z } from '@app/lib/vi-zod';

export const renter = z.object({
  id: z.string(),
  houseId: z.string(),
  floorId: z.string().nullable().optional(),
  roomId: z.string().nullable().optional(),
  floorName: z.string().nullable().optional(),
  roomName: z.string().nullable().optional(),
  renterName: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  citizenId: z.string().nullable().optional(),
  birthday: z.string().or(z.date()).nullable(),
  gender: z.string(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable().optional(),
  address: z
    .object({
      city: z.string().nullable().optional(),
      district: z.string().nullable().optional(),
      ward: z.string().nullable().optional(),
      street: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  tempReg: z.boolean(),
  moveInDate: z.string().or(z.date()).nullable().optional(),
  represent: z.boolean().nullable().optional(),
  note: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const renterData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(renter),
  })
  .nullable();

export const renterIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: renterData,
});

export const renterDetailRequestSchema = z.string();

export const renterDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: renter,
});

export type RenterSchema = z.infer<typeof renter>;
export type RenterDataSchema = z.infer<typeof renterData>;
export type RenterIndexResponseSchema = z.infer<
  typeof renterIndexResponseSchema
>;
export type RenterDetailResponseSchema = z.infer<
  typeof renterDetailResponseSchema
>;
export type RenterDetailRequestSchema = z.infer<
  typeof renterDetailRequestSchema
>;

export const renterKeys = {
  all: ['renters'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...renterKeys.all, 'list', ...(params ? [params] : [])] as const,
};
