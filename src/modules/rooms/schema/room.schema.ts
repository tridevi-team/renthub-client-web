import { z } from '@app/lib/vi-zod';

export const room = z.object({
  id: z.string(),
  name: z.string(),
  maxRenters: z.coerce.number().nullable().default(1),
  roomArea: z.coerce.number().nullable().default(1),
  price: z.coerce.number().nullable().default(0),
  description: z.string().nullable(),
  contact: z
    .object({
      fullName: z.string().nullable(),
      phone_number: z.string().nullable(),
      email: z.string().nullable(),
    })
    .nullable()
    .optional(),
  services: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.coerce.number().nullable().default(0),
        unitPrice: z.coerce.number().nullable().default(0),
        type: z.string(),
        startIndex: z.coerce.number().nullable().optional().default(0),
        description: z.string().nullable(),
      }),
    )
    .nullable()
    .optional(),
  equipment: z
    .array(
      z.object({
        id: z.string(),
        houseId: z.string(),
        floorId: z.string(),
        roomId: z.string(),
        code: z.string(),
        name: z.string(),
        status: z.string(),
        sharedType: z.string(),
        description: z.string(),
      }),
    )
    .nullable()
    .optional(),
  images: z.array(z.string()).nullable().optional(),
  status: z.string(),
  createdBy: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const roomData = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
  total: z.number(),
  results: z.array(room),
});

export const roomIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: roomData,
});

export const roomDetailRequestSchema = z.string();

export const roomDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: room,
});

export const roomFormRequestSchema = z.object({
  name: z.string().trim().min(1),
  floor: z.string().trim().min(1), // floorId
  maxRenters: z.coerce.number().nullable().default(1),
  roomArea: z.coerce.number().nullable().default(1),
  price: z.coerce.number().nullable().default(0),
  serviceIds: z.array(z.string()).min(1),
  images: z.any(),
  description: z.string().nullable().optional(),
  status: z.string(),
});

export const roomCreateRequestSchema = z.object({
  name: z.string().trim().min(1),
  floor: z.string().trim().min(1), // floorId
  maxRenters: z.coerce.number().nullable().default(1),
  roomArea: z.coerce.number().nullable().default(1),
  price: z.coerce.number().nullable().default(0),
  services: z
    .array(
      z.object({
        serviceId: z.string(),
        quantity: z.coerce.number().nullable().default(0),
        startIndex: z.coerce.number().nullable().optional().default(0),
      }),
    )
    .nullable()
    .optional(),
  images: z.array(z.string()).nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.string(),
});

export const roomCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const roomUpdateRequestSchema = z.object({
  name: z.string().trim().min(1),
  floor: z.string().trim().min(1), // floorId
  maxRenters: z.coerce.number().nullable().default(1),
  roomArea: z.coerce.number().nullable().default(1),
  price: z.coerce.number().nullable().default(0),
  services: z
    .array(
      z.object({
        serviceId: z.string(),
        quantity: z.coerce.number().nullable().default(0),
        startIndex: z.coerce.number().nullable().optional().default(0),
      }),
    )
    .nullable()
    .optional(),
  images: z.array(z.string()).nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.string(),
});

export const roomUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const roomDeleteRequestSchema = z.string();

export const roomDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const roomDeleteManyRequestSchema = z.array(z.string());

export const roomDeleteManyResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export type RoomSchema = z.infer<typeof room>;
export type RoomDataSchema = z.infer<typeof roomData>;
export type RoomIndexResponseSchema = z.infer<typeof roomIndexResponseSchema>;
export type RoomDetailRequestSchema = z.infer<typeof roomDetailRequestSchema>;
export type RoomDetailResponseSchema = z.infer<typeof roomDetailResponseSchema>;
export type RoomFormRequestSchema = z.infer<typeof roomFormRequestSchema>;
export type RoomCreateRequestSchema = z.infer<typeof roomCreateRequestSchema>;
export type RoomCreateResponseSchema = z.infer<typeof roomCreateResponseSchema>;
export type RoomUpdateRequestSchema = z.infer<typeof roomUpdateRequestSchema>;
export type RoomUpdateResponseSchema = z.infer<typeof roomUpdateResponseSchema>;
export type RoomDeleteRequestSchema = z.infer<typeof roomDeleteRequestSchema>;
export type RoomDeleteResponseSchema = z.infer<typeof roomDeleteResponseSchema>;
export type RoomDeleteManyRequestSchema = z.infer<
  typeof roomDeleteManyRequestSchema
>;
export type RoomDeleteManyResponseSchema = z.infer<
  typeof roomDeleteManyResponseSchema
>;

export const roomKeys = {
  all: ['rooms'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...roomKeys.all, 'list', ...(params ? [params] : [])] as const,
};
