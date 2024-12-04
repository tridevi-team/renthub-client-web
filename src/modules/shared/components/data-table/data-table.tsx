import type { DataTableFilterField } from '@app/types';
import type { PermissionKeyType } from '@modules/auth/schemas/auth.schema';
import { DataTablePagination } from '@shared/components/data-table/data-table-pagination';
import { TableToolbarActions } from '@shared/components/data-table/data-toolbar-action';
import { DataTableAdvancedToolbar } from '@shared/components/data-table/filters/data-table-advanced-toolbar';
import { ScrollableDiv } from '@shared/components/extensions/scrollable-div';
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
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from '@tanstack/react-table';
interface DataTableProps<TData, TValue> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  filterOptions?: DataTableFilterField<TData>[];
  loading?: boolean;
  actions?: {
    onDelete?: (selectedItems: TData[]) => Promise<void>;
    onCreate?: () => Promise<void> | void;
    onDownload?: () => Promise<void> | void;
  };
  additionalActionButtons?: (table: TanstackTable<TData>) => React.ReactNode;
  columnWidths?: string[];
  moduleName?: PermissionKeyType;
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
  columnWidths = [],
  moduleName,
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
          moduleName={moduleName}
        />
      </DataTableAdvancedToolbar>
      <ScrollableDiv className="max-h-[59vh] overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-[100]"
                    style={{ width: columnWidths[index] }}
                  >
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
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: columnWidths[index] }}
                    >
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
                  {t('common_no_result_found')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollableDiv>
      <DataTablePagination table={table} loading={loading} />
    </div>
  );
}
