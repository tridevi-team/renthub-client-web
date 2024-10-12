export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  comparisonOperators: [
    { label: 'Chứa', value: 'cont' as const },
    { label: 'Không chứa', value: 'ncont' as const },
    { label: 'Là', value: 'eq' as const },
    { label: 'Không là', value: 'ne' as const },
    { label: 'Bắt đầu với', value: 'sw' as const },
    { label: 'Kết thúc với', value: 'ew' as const },
    { label: 'Trống', value: 'isnull' as const },
    { label: 'Không trống', value: 'isnotnull' as const },
  ],
  selectableOperators: [
    { label: 'Là', value: 'in' as const },
    { label: 'Không là', value: 'nin' as const },
    { label: 'Trống', value: 'isNull' as const },
    { label: 'Không trống', value: 'isNotNull' as const },
  ],
  numberOperators: [
    { label: 'Bằng', value: 'eq' as const },
    { label: 'Không bằng', value: 'ne' as const },
    { label: 'Lớn hơn', value: 'gt' as const },
    { label: 'Lớn hơn hoặc bằng', value: 'gte' as const },
    { label: 'Nhỏ hơn', value: 'lt' as const },
    { label: 'Nhỏ hơn hoặc bằng', value: 'lte' as const },
    { label: 'Trong', value: 'in' as const },
    { label: 'Không trong', value: 'nin' as const },
  ],
  logicalOperators: [
    {
      label: 'Và',
      value: 'and' as const,
      description: 'Tất cả các điều kiện phải được thỏa mãn',
    },
    {
      label: 'Hoặc',
      value: 'or' as const,
      description: 'Một trong các điều kiện phải được thỏa mãn',
    },
  ],
  sortDirections: [
    { label: 'Tăng dần', value: 'asc' as const },
    { label: 'Giảm dần', value: 'desc' as const },
  ],
  defaultSortDirection: 'asc' as const,
  defaultPageSize: 25,
  defaultPageSizes: [10, 25, 50, 100],
  defaultColumnWidth: 150,
  defaultColumnMinWidth: 100,
  defaultColumnMaxWidth: 300,
  defaultColumnResizable: true,
  defaultColumnSortable: true,
  defaultColumnFilterable: true,
  defaultColumnFilterOperator: 'cont' as const,
};
