import type { ErrorResponseSchema } from '@shared/schemas/api.schema';

export function isErrorResponseSchema(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any,
): error is ErrorResponseSchema {
  return (
    error && typeof error.code === 'string' && typeof error.message === 'string'
  );
}
