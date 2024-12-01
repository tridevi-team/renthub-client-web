import { z } from '@app/lib/vi-zod';

export const equipment = z.object({
  id: z.string(),
  houseId: z.string(),
  floorId: z.string().nullable(),
  roomId: z.string().nullable(),
  code: z.string().nullable(),
  name: z.string(),
  status: z.enum(['NORMAL', 'BROKEN', 'REPAIRING', 'DISPOSED']).nullable(),
  sharedType: z.string(),
  description: z.string().nullable(),
  createdBy: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
  floorName: z.string().nullable(),
  roomName: z.string().nullable(),
});

export const equipmentData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(equipment),
  })
  .nullable();

export const equipmentIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: equipmentData,
});

export const equipmentDetailRequestSchema = z.string();

export const equipmentDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: equipment,
});

export const equipmentCreateRequestSchema = z.object({
  floorId: z.string().nullable().optional(),
  roomId: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  name: z.string().trim().min(1),
  status: z.string().nullable().optional(),
  sharedType: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const equipmentCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const equipmentUpdateRequestSchema = z.object({
  floorId: z.string().nullable().optional(),
  roomId: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  name: z.string().trim().min(1),
  status: z.string().nullable().optional(),
  sharedType: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const equipmentUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const equipmentDeleteRequestSchema = z.string();

export const equipmentDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const equipmentDeleteManyRequestSchema = z.object({
  ids: z.array(z.string()),
});

export const equipmentDeleteManyResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const equipmentUpdateStatusRequestSchema = z.object({
  status: z.string(),
  sharedType: z.string(),
});

export const equipmentUpdateStatusResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type EquipmentSchema = z.infer<typeof equipment>;
export type EquipmentDataSchema = z.infer<typeof equipmentData>;
export type EquipmentIndexResponseSchema = z.infer<
  typeof equipmentIndexResponseSchema
>;
export type EquipmentDetailRequestSchema = z.infer<
  typeof equipmentDetailRequestSchema
>;
export type EquipmentDetailResponseSchema = z.infer<
  typeof equipmentDetailResponseSchema
>;
export type EquipmentCreateRequestSchema = z.infer<
  typeof equipmentCreateRequestSchema
>;
export type EquipmentCreateResponseSchema = z.infer<
  typeof equipmentCreateResponseSchema
>;
export type EquipmentUpdateRequestSchema = z.infer<
  typeof equipmentUpdateRequestSchema
>;
export type EquipmentUpdateResponseSchema = z.infer<
  typeof equipmentUpdateResponseSchema
>;
export type EquipmentDeleteRequestSchema = z.infer<
  typeof equipmentDeleteRequestSchema
>;
export type EquipmentDeleteResponseSchema = z.infer<
  typeof equipmentDeleteResponseSchema
>;
export type EquipmentDeleteManyRequestSchema = z.infer<
  typeof equipmentDeleteManyRequestSchema
>;
export type EquipmentDeleteManyResponseSchema = z.infer<
  typeof equipmentDeleteManyResponseSchema
>;
export type EquipmentUpdateStatusRequestSchema = z.infer<
  typeof equipmentUpdateStatusRequestSchema
>;
export type EquipmentUpdateStatusResponseSchema = z.infer<
  typeof equipmentUpdateStatusResponseSchema
>;

export const equipmentKeys = {
  all: ['equipments'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...equipmentKeys.all, 'list', ...(params ? [params] : [])] as const,
};
