export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string | number;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
  code?: string | number;
  description?: string;
  imageUrl?: string;
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
  type?: 'text' | 'select' | 'date' | 'number';
  value: keyof TData;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: {
    label: string;
    value: string;
  }[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}
