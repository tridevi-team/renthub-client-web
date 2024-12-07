import type { ErrorResponseSchema } from '@shared/schemas/api.schema';

export interface RangeValue<T> {
  /** The start value of the range. */
  start: T;
  /** The end value of the range. */
  end: T;
}

export type AwaitToResult<T> = [ErrorResponseSchema | null, T | undefined];
