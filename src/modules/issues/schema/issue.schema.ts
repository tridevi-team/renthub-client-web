import { z } from '@app/lib/vi-zod';

export const issue = z.object({
  id: z.string(),
  houseId: z.string(),
  floorId: z.string().nullable().optional(),
  roomId: z.string().nullable().optional(),
  floorName: z.string().nullable().optional(),
  roomName: z.string().nullable().optional(),
  title: z.string(),
  content: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  files: z
    .object({
      image: z.array(z.string()).nullable().optional(),
      video: z.array(z.string()).nullable().optional(),
      file: z.array(z.string()).nullable().optional(),
    })
    .nullable()
    .optional(),
  assignTo: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  equipmentId: z.string().nullable().optional(),
  equipmentName: z.string().nullable().optional(),
  createdName: z.string().nullable().optional(),
  assigneeName: z.string().nullable().optional(),
});

export const issueData = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
    results: z.array(issue),
  })
  .nullable();

export const issueIndexResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: issueData,
});

export const issueDetailRequestSchema = z.string();

export const issueDetailResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
  data: issue,
});

export const issueDeleteRequestSchema = z.string();

export const issueDeleteResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const issueDeleteManyRequestSchema = z.array(z.string());

export const issueDeleteManyResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export const issueUpdateStatusRequestSchema = z.object({
  id: z.string(),
  status: z.string(),
});

export const issueUpdateStatusFormRequestSchema = z.object({
  status: z.string(),
});

export const issueUpdateStatusResponseSchema = z.object({
  success: z.boolean(),
  code: z.string(),
  message: z.string(),
});

export type IssueSchema = z.infer<typeof issue>;
export type IssueDataSchema = z.infer<typeof issueData>;
export type IssueIndexResponseSchema = z.infer<typeof issueIndexResponseSchema>;
export type IssueDetailRequestSchema = z.infer<typeof issueDetailRequestSchema>;
export type IssueDetailResponseSchema = z.infer<
  typeof issueDetailResponseSchema
>;
export type IssueUpdateStatusRequestSchema = z.infer<
  typeof issueUpdateStatusRequestSchema
>;
export type IssueUpdateStatusFormRequestSchema = z.infer<
  typeof issueUpdateStatusFormRequestSchema
>;
export type IssueUpdateStatusResponseSchema = z.infer<
  typeof issueUpdateStatusResponseSchema
>;
export type IssueDeleteRequestSchema = z.infer<typeof issueDeleteRequestSchema>;
export type IssueDeleteResponseSchema = z.infer<
  typeof issueDeleteResponseSchema
>;
export type IssueDeleteManyRequestSchema = z.infer<
  typeof issueDeleteManyRequestSchema
>;
export type IssueDeleteManyResponseSchema = z.infer<
  typeof issueDeleteManyResponseSchema
>;

export const issueKeys = {
  all: ['issues'] as const,
  list: (params: Record<string, string | string[]> | undefined) =>
    [...issueKeys.all, 'list', ...(params ? [params] : [])] as const,
};
