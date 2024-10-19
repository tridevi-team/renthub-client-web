import type { DataTableFilterField } from '@app/types';
import { useDebouncedCallback } from '@shared/hooks/use-debounced-callback';
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  filterFields?: DataTableFilterField<TData>[];
  debounceMs?: number;
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: {
      id: Extract<keyof TData, string>;
      desc: boolean;
    }[];
  };
  enableAdvancedFilter?: boolean;
}

export function useDataTable<TData>({
  pageCount = -1,
  filterFields = [],
  debounceMs = 300,
  initialState,
  enableAdvancedFilter = true,
  ...props
}: UseDataTableProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  // Helper functions to get and set search params
  const getParam = (
    key: string,
    defaultValue: string | number,
  ): string | number => {
    const value = searchParams.get(key);
    return value !== null ? value : defaultValue;
  };

  const setParam = (key: string, value: string | number) => {
    setSearchParams((prev) => {
      prev.set(key, value.toString());
      return prev;
    });
  };

  // Pagination
  const page = Number.parseInt(getParam('page', 1).toString(), 10);
  const perPage = Number.parseInt(
    getParam('pageSize', initialState?.pagination?.pageSize ?? 10).toString(),
    10,
  );

  // Sorting
  const sort = getParam(
    'sort',
    `${initialState?.sorting?.[0]?.id}.${initialState?.sorting?.[0]?.desc ? 'desc' : 'asc'}`,
  );
  const [column, order] = (sort as string).split('.');

  // Filters
  const getFilterValues = () => {
    return filterFields.reduce<Record<string, string | string[]>>(
      (acc, field) => {
        const value = searchParams.get(field.value as string);
        if (value !== null) {
          acc[field.value as string] = field.options ? value.split('.') : value;
        }
        return acc;
      },
      {},
    );
  };

  const setFilterValues = (
    values: Record<string, string | string[] | null>,
  ) => {
    setSearchParams((prev) => {
      for (const [key, value] of Object.entries(values)) {
        if (value === null) {
          prev.delete(key);
        } else if (Array.isArray(value)) {
          prev.set(key, value.join('.'));
        } else {
          prev.set(key, value);
        }
      }
      return prev;
    });
  };

  const filterValues = getFilterValues();

  const debouncedSetFilterValues = useDebouncedCallback(
    setFilterValues,
    debounceMs,
  );

  // Paginate
  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: perPage,
  };

  function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
    if (typeof updaterOrValue === 'function') {
      const newPagination = updaterOrValue(pagination);
      setParam('page', newPagination.pageIndex + 1);
      setParam('pageSize', newPagination.pageSize);
    } else {
      setParam('page', updaterOrValue.pageIndex + 1);
      setParam('pageSize', updaterOrValue.pageSize);
    }
  }

  // Sort
  const sorting: SortingState = [{ id: column ?? '', desc: order === 'desc' }];

  function onSortingChange(updaterOrValue: Updater<SortingState>) {
    if (typeof updaterOrValue === 'function') {
      const newSorting = updaterOrValue(sorting);
      setParam(
        'sort',
        `${newSorting[0]?.id}.${newSorting[0]?.desc ? 'desc' : 'asc'}`,
      );
    }
  }

  // Filter
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return enableAdvancedFilter
      ? []
      : Object.entries(filterValues).reduce<ColumnFiltersState>(
          (filters, [key, value]) => {
            if (value !== null) {
              filters.push({
                id: key,
                value: Array.isArray(value) ? value : [value],
              });
            }
            return filters;
          },
          [],
        );
  }, [filterValues, enableAdvancedFilter]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return enableAdvancedFilter
      ? { searchableColumns: [], filterableColumns: [] }
      : {
          searchableColumns: filterFields.filter((field) => !field.options),
          filterableColumns: filterFields.filter((field) => field.options),
        };
  }, [filterFields, enableAdvancedFilter]);

  const onColumnFiltersChange = React.useCallback(
    (updateOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;

      setColumnFilters((prev) => {
        const next =
          typeof updateOrValue === 'function'
            ? updateOrValue(prev)
            : updateOrValue;

        const filterUpdates = next.reduce<
          Record<string, string | string[] | null>
        >((acc, filter) => {
          if (searchableColumns.find((col) => col.value === filter.id)) {
            acc[filter.id] = filter.value as string;
          } else if (filterableColumns.find((col) => col.value === filter.id)) {
            acc[filter.id] = filter.value as string[];
          }
          return acc;
        }, {});

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [
      debouncedSetFilterValues,
      filterableColumns,
      searchableColumns,
      enableAdvancedFilter,
    ],
  );

  const table = useReactTable({
    ...props,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters: enableAdvancedFilter ? [] : columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableAdvancedFilter
      ? undefined
      : getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: enableAdvancedFilter ? undefined : getFacetedRowModel(),
    getFacetedUniqueValues: enableAdvancedFilter
      ? undefined
      : getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table };
}
