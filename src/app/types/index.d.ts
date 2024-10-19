export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface FilterOption {
  field: string;
  operator?: string;
  value: string | number | string[] | number[];
}

export interface SortOption {
  field: string;
  direction: string;
}

export interface QueryOptions {
  filters?: FilterOption[];
  sorting?: SortOption[];
  pageSize?: number;
  page?: number;
}

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}
