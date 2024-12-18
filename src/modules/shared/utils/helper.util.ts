import { useHouseStore } from '@app/stores';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { deepReadObject } from '@rifandani/nxact-yutiriti';
import React from 'react';
import { extendTailwindMerge } from 'tailwind-merge';

// declare a type that works with generic components
type FixedForwardRef = <T, P = object>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode;

// cast the old forwardRef to the new one
export const fixedForwardRef = React.forwardRef as FixedForwardRef;

/**
 * Provided a string template it will replace dynamics parts in place of variables.
 * This util is largely inspired by [templite](https://github.com/lukeed/templite/blob/master/src/index.js)
 *
 * @param str {string} - The string you wish to use as template
 * @param params {Record<string, string>} - The params to inject into the template
 * @param reg {RegExp} - The RegExp used to find and replace. Default to `/{{(.*?)}}/g`
 *
 * @returns {string} - The fully injected template
 *
 * @example
 * ```ts
 * const txt = template('Hello {{ name }}', { name: 'Tom' });
 * // => 'Hello Tom'
 * ```
 */
export function template(
  str: string,
  params: Record<string, string>,
  reg = /{{(.*?)}}/g,
): string {
  return str.replace(reg, (_, key: string) => deepReadObject(params, key, ''));
}

export function clamp({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if we are in browser, not server
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Format phone number based on mockup, currently only covered minimum 10 characters and max 11 characters include +84
 * e.g +84-912-345-678
 *
 * @param phoneNumber - input should include "+84"
 */
export function vietnamesePhoneNumberFormat(phoneNumber: string) {
  // e.g: +84
  const code = phoneNumber.slice(0, 3);
  const numbers = phoneNumber.slice(3);
  // e.g 912, 123
  const ndc = numbers.slice(0, 3);
  // e.g the rest of the numbers
  const uniqNumber = numbers.slice(3);
  let regexp: RegExp;

  if (uniqNumber.length <= 6) regexp = /(\d{3})(\d{1,})/;
  else if (uniqNumber.length === 7) regexp = /(\d{3})(\d{4})/;
  else regexp = /(\d{3})(\d{4,})/;

  const matches = uniqNumber.replace(regexp, '$1-$2');

  return [code, ndc, matches].join('-');
}

/**
 * convert deep nested object keys to camelCase.
 */
export function toCamelCase<T>(object: unknown): T {
  let transformedObject = object as Record<string, unknown>;
  if (typeof object === 'object' && object !== null) {
    if (Array.isArray(object)) {
      transformedObject = object.map(toCamelCase) as unknown as Record<
        string,
        unknown
      >;
    } else {
      transformedObject = {};
      for (const key of Object.keys(object)) {
        if ((object as Record<string, unknown>)[key] !== undefined) {
          const firstUnderscore = key.replace(/^_/, '');
          const newKey = firstUnderscore.replace(/(_\w)|(-\w)/g, (k) =>
            k[1].toUpperCase(),
          );
          transformedObject[newKey] = toCamelCase(
            (object as Record<string, unknown>)[key],
          );
        }
      }
    }
  }
  return transformedObject as T;
}

/**
 * convert deep nested object keys to snake_case.
 */
export function toSnakeCase<T>(object: unknown): T {
  let transformedObject = object as Record<string, unknown>;
  if (typeof object === 'object' && object !== null) {
    if (Array.isArray(object)) {
      transformedObject = object.map(toSnakeCase) as unknown as Record<
        string,
        unknown
      >;
    } else {
      transformedObject = {};
      for (const key of Object.keys(object)) {
        if ((object as Record<string, unknown>)[key] !== undefined) {
          const newKey = key
            .replace(
              /\.?([A-Z]+)/g,
              (_, y) => `_${y ? (y as string).toLowerCase() : ''}`,
            )
            .replace(/^_/, '');
          transformedObject[newKey] = toSnakeCase(
            (object as Record<string, unknown>)[key],
          );
        }
      }
    }
  }
  return transformedObject as T;
}

/**
 * Remove leading zero
 */
export function removeLeadingZeros(value: string) {
  if (/^([0]{1,})([1-9]{1,})/i.test(value)) return value.replace(/^(0)/i, '');

  return value.replace(/^[0]{2,}/i, '0');
}

/**
 * Remove leading whitespaces
 */
export function removeLeadingWhitespace(value?: string) {
  if (!value) return '';
  if (/^[\s]*$/i.test(value)) return value.replace(/^[\s]*/i, '');

  return value;
}

/**
 * This will works with below rules, otherwise it only view on new tab
 * 1. If the file source located in the same origin as the application.
 * 2. If the file source is on different location e.g s3 bucket, etc. Set the response headers `Content-Disposition: attachment`.
 */
export function doDownload(url: string) {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = url;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * create merge function with custom config which extends the default config.
 * Use this if you use the default Tailwind config and just extend it in some places.
 */
export const tw = extendTailwindMerge<'alert'>({
  extend: {
    classGroups: {
      // ↓ The `foo` key here is the class group ID
      //   ↓ Creates group of classes which have conflicting styles
      //     Classes here: 'alert-info', 'alert-success', 'alert-warning', 'alert-error'
      alert: ['alert-info', 'alert-success', 'alert-warning', 'alert-error'],
    },
    // ↓ Here you can define additional conflicts across different groups
    conflictingClassGroups: {
      // ↓ ID of class group which creates a conflict with…
      //     ↓ …classes from groups with these IDs
      // In this case `tw('alert-success alert-error') → 'alert-error'`
      alert: ['alert'],
    },
  },
});

/**
 * Processes URL search parameters to extract filters, sorting, pagination page, and page size.
 *
 * @param params - The URLSearchParams object containing the search parameters.
 * @param defaultFieldPrefix - An optional prefix to add to the field names in the filters and sorting.
 * @param defaultSorting - An optional object specifying the default sorting field and direction.
 * @param nameFieldToPrefix - An optional object mapping field names to their respective prefixes.
 * @returns An object containing the following properties:
 * - `filters`: An array of filter objects, each containing `field`, `operator`, and `value`.
 * - `sorting`: An array of sorting objects, each containing `field` and `direction`.
 * - `page`: The current page number.
 * - `pageSize`: The number of items per page.
 */
export const processSearchParams = (
  params: URLSearchParams,
  defaultFieldPrefix = '',
  defaultSorting = { field: 'createdAt', direction: 'desc' },
  nameFieldToPrefix: Record<string, string> = {}, // { name: 'prefix1', fullname: 'prefix2' }
): {
  filters: Array<{ field: string; operator: string; value: string }>;
  sorting: Array<{ field: string; direction: string }>;
  page: number;
  pageSize: number;
} => {
  const filters = params.getAll('filter').map((filter) => {
    const [field, operator, value] = filter.split(':');
    const prefix = nameFieldToPrefix[field] || defaultFieldPrefix;
    return { field: `${prefix}.${field}`, operator, value };
  });

  const sort = params.get('sort')?.split('.') || [];
  const sorting = sort[0]
    ? [
        {
          field: `${nameFieldToPrefix[sort[0]] || defaultFieldPrefix}.${sort[0]}`,
          direction: sort[1],
        },
      ]
    : [
        {
          field: `${defaultFieldPrefix}.${defaultSorting.field}`,
          direction: defaultSorting.direction,
        },
      ];

  const page = Number.parseInt(params.get('page') || '1', 10);
  const pageSize = Number.parseInt(params.get('pageSize') || '10', 10);

  return { filters, sorting, page, pageSize };
};

export const getHouseSelected = () => {
  return useHouseStore.getState().data;
};

export const getUserAppStore = () => {
  return useAuthUserStore.getState().user;
};

export const compareFloorNames = (a: string, b: string) => {
  const splitA = a.match(/(\d+|\D+)/g) || [];
  const splitB = b.match(/(\d+|\D+)/g) || [];

  const len = Math.min(splitA.length, splitB.length);

  for (let i = 0; i < len; i++) {
    const aIsNum = !Number.isNaN(Number(splitA[i]));
    const bIsNum = !Number.isNaN(Number(splitB[i]));

    if (aIsNum && bIsNum) {
      const diff = Number(splitA[i]) - Number(splitB[i]);
      if (diff !== 0) return diff;
    } else {
      const diff = splitA[i].localeCompare(splitB[i]);
      if (diff !== 0) return diff;
    }
  }
  return splitA.length - splitB.length;
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}
