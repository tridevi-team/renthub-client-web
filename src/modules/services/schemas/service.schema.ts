import { z } from '@app/lib/vi-zod';

export const service = z.object({
  id: z.string(),
  houseId: z.string(),
  name: z.string(),
  unitPrice: z.number(),
  type: z.string(),
  description: z.string().nullable(),
  createdBy: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const serviceData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(service),
  })
  .nullable();

export const serviceIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: serviceData,
});

export const serviceDetailRequestSchema = z.string();

export const serviceDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: service,
});

export const serviceCreateRequestSchema = z.object({
  name: z.string().trim().min(1),
  unitPrice: z.coerce.number(),
  type: z.string(),
  description: z.string().nullable().optional(),
  typeIndex: z.string().nullable().optional(),
});

export const serviceCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const serviceUpdateRequestSchema = z.object({
  name: z.string().trim().min(1),
  unitPrice: z.coerce.number(),
  type: z.string(),
  description: z.string().nullable().optional(),
  typeIndex: z.string().nullable().optional(),
});

export const serviceUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const serviceDeleteRequestSchema = z.string();

export const serviceDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const serviceDeleteManyRequestSchema = z.array(z.string());

export const serviceDeleteManyResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const serviceAddToRoomRequestSchema = z.object({
  roomId: z.string(),
  services: z.array(
    z.object({
      serviceId: z.string(),
      quantity: z.number(),
      startIndex: z.number().nullable().optional().default(1),
      description: z.string().nullable().optional(),
    }),
  ),
});

export const serviceAddToRoomResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const serviceAddManyToRoomRequestSchema = z.object({
  ids: z.array(z.string()),
  services: z.array(
    z.object({
      serviceId: z.string(),
      quantity: z.number(),
      startIndex: z.number().nullable().optional().default(1),
      description: z.string().nullable().optional(),
    }),
  ),
});

export const serviceAddManyToRoomResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const serviceRemoveServiceFromRoomRequestSchema = z.object({
  roomId: z.string(),
  serviceIds: z.array(z.string()),
});

export const serviceRemoveServiceFromRoomResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export type ServiceSchema = z.infer<typeof service>;
export type ServiceDataSchema = z.infer<typeof serviceData>;
export type ServiceIndexResponseSchema = z.infer<
  typeof serviceIndexResponseSchema
>;
export type ServiceDetailRequestSchema = z.infer<
  typeof serviceDetailRequestSchema
>;
export type ServiceDetailResponseSchema = z.infer<
  typeof serviceDetailResponseSchema
>;
export type ServiceCreateRequestSchema = z.infer<
  typeof serviceCreateRequestSchema
>;
export type ServiceCreateResponseSchema = z.infer<
  typeof serviceCreateResponseSchema
>;
export type ServiceUpdateRequestSchema = z.infer<
  typeof serviceUpdateRequestSchema
>;
export type ServiceUpdateResponseSchema = z.infer<
  typeof serviceUpdateResponseSchema
>;
export type ServiceDeleteRequestSchema = z.infer<
  typeof serviceDeleteRequestSchema
>;
export type ServiceDeleteResponseSchema = z.infer<
  typeof serviceDeleteResponseSchema
>;
export type ServiceDeleteManyRequestSchema = z.infer<
  typeof serviceDeleteManyRequestSchema
>;
export type ServiceDeleteManyResponseSchema = z.infer<
  typeof serviceDeleteManyResponseSchema
>;
export type ServiceAddToRoomRequestSchema = z.infer<
  typeof serviceAddToRoomRequestSchema
>;
export type ServiceAddToRoomResponseSchema = z.infer<
  typeof serviceAddToRoomResponseSchema
>;
export type ServiceAddManyToRoomRequestSchema = z.infer<
  typeof serviceAddManyToRoomRequestSchema
>;
export type ServiceAddManyToRoomResponseSchema = z.infer<
  typeof serviceAddManyToRoomResponseSchema
>;
export type ServiceRemoveServiceFromRoomRequestSchema = z.infer<
  typeof serviceRemoveServiceFromRoomRequestSchema
>;
export type ServiceRemoveServiceFromRoomResponseSchema = z.infer<
  typeof serviceRemoveServiceFromRoomResponseSchema
>;

export const serviceKeys = {
  all: ['services'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...serviceKeys.all, 'list', ...(params ? [params] : [])] as const,
};
