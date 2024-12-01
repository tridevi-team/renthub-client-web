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
  createdBy: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
  numOfFloors: z.number().optional().nullable(),
  numOfRoomsPerFloor: z.number().optional().nullable(),
  maxRenters: z.number().optional().nullable(),
  roomArea: z.number().optional().nullable(),
  roomPrice: z.number().optional().nullable(),
  floors: z.array(z.unknown()).optional(),
});

export const houseData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(house),
  })
  .nullable();

export const houseIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: houseData,
});

export const houseDetailRequestSchema = z.string();
export const houseDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: house,
});
export const houseCreateRequestSchema = z.object({
  name: z.string().min(1),
  city: z.string().trim(),
  ward: z.string().trim(),
  street: z.string().trim(),
  district: z.string().trim(),
  numOfFloors: z.coerce.number().min(1),
  numOfRoomsPerFloor: z.coerce.number().min(1),
  maxRenters: z.coerce.number().min(1),
  roomArea: z.coerce.number().min(1),
  roomPrice: z.coerce.number().min(1000),
  description: z.string().default(''),
  collectionCycle: z.coerce.number().min(1).max(60),
  invoiceDate: z.coerce.number().min(1).max(31),
  numCollectDays: z.coerce.number().min(1).max(365),
});
export const houseCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: house,
});

export const houseUpdateRequestSchema = z.object({
  id: z.string(),
  name: z.string().trim(),
  city: z.string().trim(),
  ward: z.string().trim(),
  street: z.string().trim(),
  district: z.string().trim(),
  contractDefault: z.string().trim().nullable(),
  description: z.string().default(''),
  collectionCycle: z.coerce.number().min(1).max(60).optional(),
  invoiceDate: z.coerce.number().min(1).max(31).optional(),
  numCollectDays: z.coerce.number().min(1).max(365).optional(),
  status: z.coerce.number().min(0).max(1),
});

export const houseUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    address: z.object({
      city: z.string(),
      ward: z.string(),
      street: z.string(),
      district: z.string(),
    }),
    contractDefault: z.string().nullable(),
    description: z.string().nullable(),
    collectionCycle: z.number(),
    invoiceDate: z.number(),
    numCollectDays: z.number(),
    status: z.number(),
    createdBy: z.string().nullable(),
    createdAt: z.string().nullable(),
    updatedBy: z.string().nullable(),
    updatedAt: z.string().nullable(),
  }),
});
export const houseDeleteRequestSchema = z.string();
export const houseDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const houseUpdateStatusRequestSchema = z.object({
  ids: z.array(z.string()),
  status: z.boolean(),
});

export const houseUpdateStatusResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type HouseSchema = z.infer<typeof house>;
export type HouseDataSchema = z.infer<typeof houseData>;
export type HouseIndexResponseSchema = z.infer<typeof houseIndexResponseSchema>;
export type HouseDetailRequestSchema = z.infer<typeof houseDetailRequestSchema>;
export type HouseDetailResponseSchema = z.infer<
  typeof houseDetailResponseSchema
>;
export type HouseCreateRequestSchema = z.infer<typeof houseCreateRequestSchema>;
export type HouseCreateResponseSchema = z.infer<
  typeof houseCreateResponseSchema
>;
export type HouseUpdateRequestSchema = z.infer<typeof houseUpdateRequestSchema>;
export type HouseUpdateResponseSchema = z.infer<
  typeof houseUpdateResponseSchema
>;
export type HouseDeleteRequestSchema = z.infer<typeof houseDeleteRequestSchema>;
export type HouseDeleteResponseSchema = z.infer<
  typeof houseDeleteResponseSchema
>;

export type HouseUpdateStatusRequestSchema = z.infer<
  typeof houseUpdateStatusRequestSchema
>;
export type HouseUpdateStatusResponseSchema = z.infer<
  typeof houseUpdateStatusResponseSchema
>;

export const houseKeys = {
  all: ['houses'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...houseKeys.all, 'list', ...(params ? [params] : [])] as const,
  detail: (id: HouseDetailRequestSchema | undefined) =>
    [...houseKeys.all, 'detail', ...(id ? [id] : [])] as const,
  create: (params: HouseCreateRequestSchema | undefined) =>
    [...houseKeys.all, 'create:mutation', ...(params ? [params] : [])] as const,
  update: (params: HouseUpdateRequestSchema | undefined) =>
    [...houseKeys.all, 'update:mutation', ...(params ? [params] : [])] as const,
  delete: (id: HouseDeleteRequestSchema | undefined) =>
    [...houseKeys.all, 'delete:mutation', ...(id ? [id] : [])] as const,
};
