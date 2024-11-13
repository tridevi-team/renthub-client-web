import { z } from '@app/lib/vi-zod';

export const floor = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  houseId: z.string(),
  createdBy: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const floorData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(floor),
  })
  .nullable();

export const floorIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: floorData,
});

export const floorDetailRequestSchema = z.string();
export const floorDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: floor,
});

export const floorCreateRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().default('').nullable(),
});

export const floorCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const floorUpdateRequestSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().default('').nullable(),
});

export const floorUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: floor,
});

export const floorDeleteRequestSchema = z.string();
export const floorDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type FloorSchema = z.infer<typeof floor>;
export type FloorDataSchema = z.infer<typeof floorData>;
export type FloorIndexResponseSchema = z.infer<typeof floorIndexResponseSchema>;
export type FloorDetailRequestSchema = z.infer<typeof floorDetailRequestSchema>;
export type FloorDetailResponseSchema = z.infer<
  typeof floorDetailResponseSchema
>;
export type FloorCreateRequestSchema = z.infer<typeof floorCreateRequestSchema>;
export type FloorCreateResponseSchema = z.infer<
  typeof floorCreateResponseSchema
>;
export type FloorUpdateRequestSchema = z.infer<typeof floorUpdateRequestSchema>;
export type FloorUpdateResponseSchema = z.infer<
  typeof floorUpdateResponseSchema
>;
export type FloorDeleteRequestSchema = z.infer<typeof floorDeleteRequestSchema>;
export type FloorDeleteResponseSchema = z.infer<
  typeof floorDeleteResponseSchema
>;

export const floorKeys = {
  all: ['floors'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...floorKeys.all, 'list', ...(params ? [params] : [])] as const,
  detail: (id: FloorDetailRequestSchema | undefined) =>
    [...floorKeys.all, 'detail', ...(id ? [id] : [])] as const,
  create: (params: FloorCreateRequestSchema | undefined) =>
    [...floorKeys.all, 'create:mutation', ...(params ? [params] : [])] as const,
  update: (params: FloorUpdateRequestSchema | undefined) =>
    [...floorKeys.all, 'update:mutation', ...(params ? [params] : [])] as const,
  delete: (id: FloorDeleteRequestSchema | undefined) =>
    [...floorKeys.all, 'delete:mutation', ...(id ? [id] : [])] as const,
};
