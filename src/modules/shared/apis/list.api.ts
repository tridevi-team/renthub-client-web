import {
  type ResourceListRequestSchema,
  resourceListRequestSchema,
} from '@shared/schemas/api.schema';
import { http } from '@shared/services/http.service';
import type { z } from 'zod';
export const createResourceListFetcher = <T extends z.ZodType>(
  endpoint: string,
  responseSchema: T,
) => {
  return async (params: ResourceListRequestSchema) => {
    const validatedParams = resourceListRequestSchema.parse(params);

    const searchParams = new URLSearchParams();

    if (validatedParams.page) {
      searchParams.append('page', validatedParams.page.toString());
    }
    if (validatedParams.pageSize) {
      searchParams.append('pageSize', validatedParams.pageSize.toString());
    }

    if (validatedParams.filters) {
      validatedParams.filters.forEach((filter, index) => {
        searchParams.append(`filters[${index}][field]`, filter.field);
        searchParams.append(`filters[${index}][operator]`, filter.operator);
        if (Array.isArray(filter.value)) {
          filter.value.forEach((val, valIndex) => {
            searchParams.append(
              `filters[${index}][value][${valIndex}]`,
              val.toString(),
            );
          });
        } else {
          searchParams.append(
            `filters[${index}][value]`,
            filter.value.toString(),
          );
        }
      });
    }

    if (validatedParams.sort) {
      validatedParams.sort.forEach((sort, index) => {
        searchParams.append(`sort[${index}][field]`, sort.field);
        searchParams.append(`sort[${index}][direction]`, sort.direction);
      });
    }

    if (validatedParams.search) {
      searchParams.append('search', validatedParams.search);
    }

    if (validatedParams.logicalOperator) {
      searchParams.append('logicalOperator', validatedParams.logicalOperator);
    }

    const response = await http.instance.get(endpoint, { searchParams }).json();
    return responseSchema.parse(response);
  };
};
