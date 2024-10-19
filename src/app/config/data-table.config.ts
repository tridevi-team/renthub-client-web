export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  comparisonOperators: [
    { label: 'Chứa', value: 'cont' as const },
    { label: 'Không chứa', value: 'ncont' as const },
    { label: 'Là', value: 'eq' as const },
    { label: 'Không là', value: 'ne' as const },
    { label: 'Bắt đầu với', value: 'sw' as const },
    { label: 'Kết thúc với', value: 'ew' as const },
  ],
  selectableOperators: [
    { label: 'Là', value: 'in' as const },
    { label: 'Không là', value: 'nin' as const },
  ],
  numberOperators: [
    { label: '=', value: 'eq' as const },
    { label: '!=', value: 'ne' as const },
    { label: '>', value: 'gt' as const },
    { label: '>=', value: 'gte' as const },
    { label: '<', value: 'lt' as const },
    { label: '<=', value: 'lte' as const },
  ],
  sortDirections: [
    { label: 'Tăng dần', value: 'asc' as const },
    { label: 'Giảm dần', value: 'desc' as const },
  ],
};
