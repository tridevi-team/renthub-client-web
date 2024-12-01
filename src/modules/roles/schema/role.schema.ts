import { z } from '@app/lib/vi-zod';
import {
  CRUDPermissionSchema,
  PERMISSION_KEY,
} from '@modules/auth/schemas/auth.schema';

export const role = z.object({
  id: z.string(),
  houseId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.number(),
  permissions: z.record(z.enum(PERMISSION_KEY), CRUDPermissionSchema),
  createdBy: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const permissions = z.record(
  z.enum(PERMISSION_KEY),
  CRUDPermissionSchema,
);

export const roleData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(role),
  })
  .nullable();

export const roleIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: roleData,
});

export const roleDetailRequestSchema = z.string();
export const roleDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: role,
});

export const roleCreateRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().default('').nullable(),
  permissions: z.record(z.enum(PERMISSION_KEY), CRUDPermissionSchema),
  status: z.string().default('active').nullable(),
});
export const roleCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const roleUpdateRequestSchema = z.object({
  name: z.string().trim().min(1),
  status: z.string().default('active').nullable(),
  description: z.string().default('').nullable(),
  permissions: z.record(z.enum(PERMISSION_KEY), CRUDPermissionSchema),
});

export const roleUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const roleDeleteRequestSchema = z.string();
export const roleDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const roleAssignRequestSchema = z.object({
  roleId: z.string(),
  userId: z.string(),
});

export const roleAssignResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type PermissionsSchema = z.infer<typeof permissions>;
export type RoleSchema = z.infer<typeof role>;
export type RoleDataSchema = z.infer<typeof roleData>;
export type RoleIndexResponseSchema = z.infer<typeof roleIndexResponseSchema>;
export type RoleDetailRequestSchema = z.infer<typeof roleDetailRequestSchema>;
export type RoleDetailResponseSchema = z.infer<typeof roleDetailResponseSchema>;
export type RoleCreateRequestSchema = z.infer<typeof roleCreateRequestSchema>;
export type RoleCreateResponseSchema = z.infer<typeof roleCreateResponseSchema>;
export type RoleUpdateRequestSchema = z.infer<typeof roleUpdateRequestSchema>;
export type RoleUpdateResponseSchema = z.infer<typeof roleUpdateResponseSchema>;
export type RoleDeleteRequestSchema = z.infer<typeof roleDeleteRequestSchema>;
export type RoleDeleteResponseSchema = z.infer<typeof roleDeleteResponseSchema>;
export type RoleAssignRequestSchema = z.infer<typeof roleAssignRequestSchema>;
export type RoleAssignResponseSchema = z.infer<typeof roleAssignResponseSchema>;

export const roleKeys = {
  all: ['roles'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...roleKeys.all, 'list', ...(params ? [params] : [])] as const,
};
