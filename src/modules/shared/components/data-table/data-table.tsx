import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from '@tanstack/react-table';

import type { DataTableFilterField } from '@app/types';
import { DataTablePagination } from '@shared/components/data-table/data-table-pagination';
import { TableToolbarActions } from '@shared/components/data-table/data-toolbar-action';
import { DataTableAdvancedToolbar } from '@shared/components/data-table/filters/data-table-advanced-toolbar';
import { Skeleton } from '@shared/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';

interface DataTableProps<TData, TValue> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  filterOptions?: DataTableFilterField<TData>[];
  loading?: boolean;
  actions?: {
    onDelete?: (selectedItems: TData[]) => Promise<void>;
    onCreate?: () => void;
    onDownload?: () => void;
  };
  additionalActionButtons?: React.ReactNode;
}

const TableRowSkeleton = ({ columns }: { columns: number }) => (
  <TableRow>
    {Array.from({ length: columns }).map((_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <TableCell key={index}>
        <Skeleton className="h-6 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

export function DataTable<TData, TValue>({
  table,
  columns,
  filterOptions = [],
  loading = false,
  actions,
  additionalActionButtons,
}: DataTableProps<TData, TValue>) {
  const rowsPerPage = table.getState().pagination.pageSize;
  const [t] = useI18n();

  return (
    <div className="space-y-4">
      <DataTableAdvancedToolbar table={table} filterFields={filterOptions}>
        <TableToolbarActions
          table={table}
          actions={actions}
          additionalButtons={additionalActionButtons}
        />
      </DataTableAdvancedToolbar>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <TableRowSkeleton key={index} columns={columns.length} />
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('common_noResultFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
