import { z } from '@app/lib/vi-zod';

export const contractTemplate = z.object({
  id: z.string(),
  houseId: z.string(),
  name: z.string(),
  content: z.string(),
  landlord: z
    .object({
      fullName: z.string().nullable().optional(),
      citizenId: z.string().nullable().optional(),
      address: z
        .object({
          city: z.string().nullable().optional(),
          district: z.string().nullable().optional(),
          ward: z.string().nullable().optional(),
          street: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      phoneNumber: z.string().nullable().optional(),
      birthday: z.string().nullable().optional(),
      dateOfIssue: z.string().nullable().optional(),
      placeOfIssue: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    })
    .nullable(),
  isActive: z.boolean().or(z.number()).nullable(),
  createdBy: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const contractTemplateData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(contractTemplate),
  })
  .nullable();

export const contractTemplateIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: contractTemplateData,
});

export const contractTemplateDetailRequestSchema = z.string();

export const contractTemplateDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: contractTemplate,
});

export const contractTemplateCreateRequestSchema = z.object({
  name: z.string().trim().min(1),
  content: z.string().trim().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
  landlord: z
    .object({
      fullName: z.string().nullable().optional(),
      citizenId: z.string().nullable().optional(),
      address: z
        .object({
          city: z.string().nullable().optional(),
          district: z.string().nullable().optional(),
          ward: z.string().nullable().optional(),
          street: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      phoneNumber: z.string().nullable().optional(),
      birthday: z.string().nullable().optional(),
      dateOfIssue: z.string().nullable().optional(),
      placeOfIssue: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const contractTemplateCreateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const contractTemplateUpdateRequestSchema = z.object({
  name: z.string().trim().min(1),
  content: z.string().trim().min(1),
  isActive: z.boolean().nullable().optional(),
  landlord: z
    .object({
      fullName: z.string().nullable().optional(),
      citizenId: z.string().nullable().optional(),
      address: z
        .object({
          city: z.string().nullable().optional(),
          district: z.string().nullable().optional(),
          ward: z.string().nullable().optional(),
          street: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      phoneNumber: z.string().nullable().optional(),
      birthday: z.string().nullable().optional(),
      dateOfIssue: z.string().nullable().optional(),
      placeOfIssue: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const contractTemplateUpdateResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: z.any(),
});

export const contractTemplateDeleteRequestSchema = z.string();

export const contractTemplateDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const contractTemplateDeleteManyRequestSchema = z.object({
  ids: z.array(z.string()),
});

export const contractTemplateDeleteManyResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type ContractTemplateSchema = z.infer<typeof contractTemplate>;
export type ContractTemplateDataSchema = z.infer<typeof contractTemplateData>;
export type ContractTemplateIndexResponseSchema = z.infer<
  typeof contractTemplateIndexResponseSchema
>;
export type ContractTemplateDetailRequestSchema = z.infer<
  typeof contractTemplateDetailRequestSchema
>;
export type ContractTemplateDetailResponseSchema = z.infer<
  typeof contractTemplateDetailResponseSchema
>;
export type ContractTemplateCreateRequestSchema = z.infer<
  typeof contractTemplateCreateRequestSchema
>;
export type ContractTemplateCreateResponseSchema = z.infer<
  typeof contractTemplateCreateResponseSchema
>;
export type ContractTemplateUpdateRequestSchema = z.infer<
  typeof contractTemplateUpdateRequestSchema
>;
export type ContractTemplateUpdateResponseSchema = z.infer<
  typeof contractTemplateUpdateResponseSchema
>;
export type ContractTemplateDeleteRequestSchema = z.infer<
  typeof contractTemplateDeleteRequestSchema
>;
export type ContractTemplateDeleteResponseSchema = z.infer<
  typeof contractTemplateDeleteResponseSchema
>;
export type ContractTemplateDeleteManyRequestSchema = z.infer<
  typeof contractTemplateDeleteManyRequestSchema
>;
export type ContractTemplateDeleteManyResponseSchema = z.infer<
  typeof contractTemplateDeleteManyResponseSchema
>;

export const contractTemplateKeys = {
  all: ['contractTemplates'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...contractTemplateKeys.all, 'list', ...(params ? [params] : [])] as const,
};
