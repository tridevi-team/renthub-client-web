import { z } from '@app/lib/vi-zod';

export const contract = z.object({
  id: z.string(),
  roomId: z.string(),
  contractId: z.string(),
  landlord: z
    .object({
      email: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      address: z
        .object({
          city: z.string().nullable().optional(),
          district: z.string().nullable().optional(),
          ward: z.string().nullable().optional(),
          street: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      birthday: z.string().nullable().optional(),
      fullName: z.string().nullable().optional(),
      citizenId: z.string().nullable().optional(),
      phoneNumber: z.string().nullable().optional(),
      dateOfIssue: z.string().nullable().optional(),
      placeOfIssue: z.string().nullable().optional(),
    })
    .nullable(),
  renter: z
    .object({
      email: z.string().nullable().optional(),
      gender: z.string().nullable().optional(),
      address: z
        .object({
          city: z.string().nullable().optional(),
          district: z.string().nullable().optional(),
          ward: z.string().nullable().optional(),
          street: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      birthday: z.string().nullable().optional(),
      fullName: z.string().nullable().optional(),
      citizenId: z.string().nullable().optional(),
      phoneNumber: z.string().nullable().optional(),
      dateOfIssue: z.string().nullable().optional(),
      placeOfIssue: z.string().nullable().optional(),
    })
    .nullable(),
  renterIds: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  depositAmount: z.number().nullable().optional(),
  depositStatus: z.string().nullable().optional(),
  depositDate: z.string().nullable().optional(),
  depositRefund: z.number().nullable().optional(),
  depositRefundDate: z.string().nullable().optional(),
  rentalStartDate: z.string().nullable().optional(),
  rentalEndDate: z.string().nullable().optional(),
  room: z
    .object({
      id: z.string(),
      name: z.string().nullable().optional(),
      price: z.number().nullable().optional(),
      roomArea: z.number().nullable().optional(),
      maxRenters: z.number().nullable().optional(),
      description: z.string().nullable().optional(),
    })
    .nullable(),
  services: z.array(
    z.object({
      id: z.string().nullable().optional(),
      name: z.string().nullable().optional(),
      type: z.string().nullable().optional(),
      quantity: z.number().nullable().optional(),
      unitPrice: z.number().nullable().optional(),
      description: z.string().nullable().optional(),
    }),
  ),
  equipment: z.array(
    z.object({
      id: z.string(),
      code: z.string().nullable().optional(),
      name: z.string().nullable().optional(),
      status: z.string().nullable().optional(),
      roomId: z.string().nullable().optional(),
      floorId: z.string().nullable().optional(),
      houseId: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      sharedType: z.string().nullable().optional(),
    }),
  ),
  status: z.string().nullable().optional(),
  approvalStatus: z.string().nullable().optional(),
  approvalNote: z.string().nullable().optional(),
  approvalDate: z.string().nullable().optional(),
  approvalBy: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const contractData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(contract),
  })
  .nullable();

export const contractIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: contractData,
});

export const contractDetailRequestSchema = z.string();

export const contractDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: contract,
});

export const contractDeleteRequestSchema = z.string();

export const contractDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const contractCreateFillFormRequestSchema = z.object({
  landlord: z.object({
    fullName: z.string(),
    citizenId: z.string(),
    address: z.object({
      city: z.string(),
      district: z.string(),
      ward: z.string(),
      street: z.string(),
    }),
    phoneNumber: z.string(),
    birthday: z.string().or(z.date()),
    dateOfIssue: z.string().or(z.date()),
    placeOfIssue: z.string(),
    gender: z.string(),
    email: z.string().nullable().optional(),
  }),
  renter: z.object({
    fullName: z.string(),
    citizenId: z.string(),
    address: z.object({
      city: z.string(),
      district: z.string(),
      ward: z.string(),
      street: z.string(),
    }),
    phoneNumber: z.string(),
    birthday: z.string().or(z.date()),
    dateOfIssue: z.string().or(z.date()),
    placeOfIssue: z.string(),
    gender: z.string(),
    email: z.string().nullable().optional(),
  }),
  depositAmount: z.coerce.number(),
  depositDate: z.string().or(z.date()),
  rentalStartDate: z.string().or(z.date()),
  rentalEndDate: z.string().or(z.date()),
  depositStatus: z.string().nullable().optional(),
});

export const contractCreateRequestSchema = z.object({
  roomId: z.string(),
  data: z.object({
    contractId: z.string(),
    depositAmount: z.number(),
    depositDate: z.string(),
    rentalStartDate: z.string(),
    rentalEndDate: z.string(),
    landlord: z.object({
      fullName: z.string(),
      citizenId: z.string(),
      address: z.object({
        city: z.string(),
        district: z.string(),
        ward: z.string(),
        street: z.string(),
      }),
      phoneNumber: z.string(),
      birthday: z.string(),
      dateOfIssue: z.string(),
      placeOfIssue: z.string(),
      gender: z.string(),
      email: z.string().nullable().optional(),
    }),
    renter: z.object({
      fullName: z.string(),
      citizenId: z.string(),
      address: z.object({
        city: z.string(),
        district: z.string(),
        ward: z.string(),
        street: z.string(),
      }),
      phoneNumber: z.string(),
      birthday: z.string(),
      dateOfIssue: z.string(),
      placeOfIssue: z.string(),
      gender: z.string(),
      email: z.string().nullable().optional(),
    }),
    room: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      roomArea: z.number(),
      maxRenters: z.number(),
      description: z.string(),
    }),
    services: z
      .array(
        z.object({
          id: z.string().nullable().optional(),
          name: z.string().nullable().optional(),
          type: z.string().nullable().optional(),
          quantity: z.number().nullable().optional(),
          unitPrice: z.number().nullable().optional(),
          description: z.string().nullable().optional(),
        }),
      )
      .optional()
      .default([]),
    equipment: z
      .array(
        z.object({
          id: z.string(),
          code: z.string().nullable().optional(),
          name: z.string().nullable().optional(),
          status: z.string().nullable().optional(),
          roomId: z.string().nullable().optional(),
          floorId: z.string().nullable().optional(),
          houseId: z.string().nullable().optional(),
          description: z.string().nullable().optional(),
          sharedType: z.string().nullable().optional(),
        }),
      )
      .optional()
      .default([]),
  }),
});

export type ContractSchema = z.infer<typeof contract>;
export type ContractDataSchema = z.infer<typeof contractData>;
export type ContractIndexResponseSchema = z.infer<
  typeof contractIndexResponseSchema
>;
export type ContractDetailRequestSchema = z.infer<
  typeof contractDetailRequestSchema
>;
export type ContractDetailResponseSchema = z.infer<
  typeof contractDetailResponseSchema
>;
export type ContractDeleteRequestSchema = z.infer<
  typeof contractDeleteRequestSchema
>;
export type ContractDeleteResponseSchema = z.infer<
  typeof contractDeleteResponseSchema
>;
export type ContractCreateRequestSchema = z.infer<
  typeof contractCreateRequestSchema
>;
export type ContractCreateFillFormRequestSchema = z.infer<
  typeof contractCreateFillFormRequestSchema
>;

export const contractKeys = {
  all: ['contracts'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...contractKeys.all, 'list', ...(params ? [params] : [])] as const,
};
