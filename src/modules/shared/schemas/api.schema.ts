import { dataTableConfig } from '@app/config/data-table.config';
import { z } from '@app/lib/vi-zod';
import {
  type ErrorLocale,
  errorLocale,
} from '@shared/hooks/use-i18n/locales/vi/error.locale';

const {
  comparisonOperators,
  selectableOperators,
  numberOperators,
  sortDirections,
} = dataTableConfig;

// #region COMMON SCHEMAS
const operatorSchema = z.union([
  z.enum(comparisonOperators.map((op) => op.value) as [string, ...string[]]),
  z.enum(selectableOperators.map((op) => op.value) as [string, ...string[]]),
  z.enum(numberOperators.map((op) => op.value) as [string, ...string[]]),
]);

const filterSchema = z.object({
  field: z.string(),
  operator: operatorSchema,
  value: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.array(z.number()),
  ]),
});

const sortSchema = z.object({
  field: z.string(),
  direction: z.enum(
    sortDirections.map((op) => op.value) as [string, ...string[]],
  ),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  code: z.enum(Object.keys(errorLocale) as [ErrorLocale, ...ErrorLocale[]]),
  message: z.string(),
});

export const resourceListRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  sort: z.array(sortSchema).optional(),
  filters: z.array(filterSchema).optional(),
});
// #endregion COMMON SCHEMAS

// #region SCHEMA TYPES
export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;
export type ResourceListRequestSchema = z.infer<
  typeof resourceListRequestSchema
>;
// #endregion SCHEMA TYPES
