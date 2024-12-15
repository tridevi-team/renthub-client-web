import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { billRepositories } from '@modules/bills/apis/bill.api';
import { ChooseMonthDialog } from '@modules/bills/components/choose-month-dialog';
import { billPath } from '@modules/bills/routes';
import { billKeys, type BillSchema } from '@modules/bills/schema/bill.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Badge } from '@shared/components/ui/badge';
import { Checkbox } from '@shared/components/ui/checkbox';
import { DEFAULT_RETURN_TABLE_DATA } from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { formatCurrency, processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { FileEdit } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  redirect,
  useLocation,
  useNavigate,
  useSearchParams,
  type LoaderFunction,
} from 'react-router-dom';
import { toast } from 'sonner';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const hasPermission = checkPermissionPage({
    module: 'bill',
    action: 'read',
  });
  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }
  if (!hasPermission) {
    return redirect(authPath.notPermission);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const fetchData = useCallback(async (params: URLSearchParams) => {
    const searchParams = processSearchParams(params, 'bills', {
      field: 'title',
      direction: 'desc',
    });

    const [err, result] = await to(billRepositories.index({ searchParams }));
    if (err) {
      return DEFAULT_RETURN_TABLE_DATA;
    }
    return result?.data;
  }, []);

  const onCreate = useCallback(() => {
    setIsDialogOpen(true);
  }, [navigate]);

  const {
    data: billData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: billKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<BillSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<BillSchema>) => {
        navigate(
          `${billPath.root}/${billPath.edit.replace(':id', row.original.id)}`,
        );
      },
    },
  ];

  const columns: ColumnDef<BillSchema>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('bill_title')} />
      ),
    },
    {
      accessorKey: 'roomName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('bill_room')} />
      ),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('bill_range_date')} />
      ),
      cell: ({ row }) => {
        const startDate = dayjs(row.original.date?.from ?? new Date()).format(
          'DD/MM/YYYY',
        );
        const endDate = dayjs(row.original.date?.to ?? new Date()).format(
          'DD/MM/YYYY',
        );
        return `${startDate} - ${endDate}`;
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('bill_amount')} />
      ),
      cell: ({ row }) => formatCurrency(row.original.amount ?? 0),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('bill_status')} />
      ),
      cell: ({ row }) => {
        const status =
          (row.original.status?.toLowerCase() as
            | 'paid'
            | 'unpaid'
            | 'cancelled'
            | 'in_debt'
            | 'overdue') ?? 'unpaid';
        return (
          <Badge
            variant={
              status === 'paid'
                ? 'success'
                : status === 'in_debt'
                  ? 'warning'
                  : status === 'cancelled' || status === 'overdue'
                    ? 'destructive'
                    : 'default'
            }
          >
            {t(`bill_s_${status}`)}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'paymentDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('bill_payment_date')} />
      ),
      cell: ({ row }) => {
        const status = row.original.status?.toLowerCase() as 'paid' | 'unpaid';
        const randomAdd = Math.floor(Math.random() * 15) + 1;
        const randomSubtract = Math.floor(Math.random() * 15) + 1;
        if (status === 'paid') {
          const paymentDate = dayjs(row.original.paymentDate);
          const adjustedDate = paymentDate
            .add(randomAdd, 'day')
            .subtract(randomSubtract, 'day');
          return adjustedDate.format('DD/MM/YYYY');
        }
        return null;
      },
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => (
        <DataTableRowActions row={row} actions={actionColumn} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const filterFields: DataTableFilterField<BillSchema>[] = [
    {
      label: t('bill_title'),
      value: 'title',
      placeholder: t('common_ph_input', {
        field: t('bill_title').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: billData?.results || [],
    columns,
    pageCount: billData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('bill_index_title')} pathname={pathname}>
      {isInitialLoading ? (
        <DataTableSkeleton
          columnCount={5}
          filterableColumnCount={2}
          cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem']}
          shrinkZero
        />
      ) : (
        <DataTable
          actions={{
            onCreate,
          }}
          table={table}
          columns={columns}
          filterOptions={filterFields}
          loading={isFetching}
          moduleName="bill"
        />
      )}
      <ChooseMonthDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </ContentLayout>
  );
}
