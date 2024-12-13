import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { contractRepositories } from '@modules/contracts/api/contract.api';
import { contractPath } from '@modules/contracts/routes';
import {
  contractKeys,
  type ContractDataSchema,
  type ContractDeleteResponseSchema,
  type ContractDetailResponseSchema,
  type ContractIndexResponseSchema,
  type ContractSchema,
} from '@modules/contracts/schemas/contract.schema';
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
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_RETURN_TABLE_DATA,
} from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { Download, FileEdit, Trash } from 'lucide-react';

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
    module: 'contract',
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

  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const fetchData = useCallback(async (params: URLSearchParams) => {
    const searchParams = processSearchParams(params, 'roomContracts ', {
      field: 'updatedAt',
      direction: 'asc',
    });

    const [err, resp]: AwaitToResult<ContractIndexResponseSchema> = await to(
      contractRepositories.index({
        searchParams,
      }),
    );
    if (err || !resp?.data) {
      return DEFAULT_RETURN_TABLE_DATA;
    }
    return resp.data;
  }, []);

  const onDelete = useCallback(
    async (selectedItems: ContractSchema[]) => {
      const [err, _]: AwaitToResult<ContractDeleteResponseSchema[]> = await to(
        Promise.all(
          selectedItems.map((item) =>
            contractRepositories.delete({ id: item.id }),
          ),
        ),
      );
      if (err) {
        if ('code' in err) {
          toast.error(t(err.code));
        } else {
          toast.error(t('UNKNOWN_ERROR'));
        }
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: contractKeys.list(queryParams),
      });
      toast.success(t('ms_delete_contract_success'));
    },
    [t, queryParams],
  );

  const onCreate = useCallback(() => {
    navigate(`${contractPath.root}/${contractPath.create}`);
  }, [navigate]);

  const onExport = async (id: string) => {
    const [err, resp]: AwaitToResult<ContractDetailResponseSchema> = await to(
      contractRepositories.detail({ id }),
    );
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return;
    }
    const data = resp?.data;
    if (!data) {
      return;
    }
    const { contract, keys } = data || {};
    const fileName = `Hop_dong_${contract?.room?.name || ''}_${contract?.renter?.fullName || ''}.pdf`;
    const htmlContent = contract?.content || '';
    const replacedHtmlContent = Object.entries(keys).reduce(
      (acc, [key, value]) => {
        return acc.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      },
      htmlContent,
    );
  };

  const {
    data: contractData,
    isLoading,
    isFetching,
  } = useQuery<ContractDataSchema>({
    queryKey: contractKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<ContractSchema>[] = [
    {
      label: t('bt_download'),
      icon: <Download className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<ContractSchema>) => {
        onExport(row.original.id);
      },
    },
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<ContractSchema>) => {
        navigate(
          `${contractPath.root}/${contractPath.edit.replace(':id', row.original.id)}`,
        );
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<ContractSchema>) => onDelete([row.original]),
    },
  ];

  const columns: ColumnDef<ContractSchema>[] = [
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
      accessorKey: 'room',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('contract_room')} />
      ),
      cell: ({ row }) => row.original.room?.name,
    },
    {
      accessorKey: 'renter',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_representative')}
        />
      ),
      cell: ({ row }) => row.original.renter?.fullName,
    },
    {
      accessorKey: 'rentalStartDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_rental_start_date')}
        />
      ),
      cell: ({ row }) => {
        const date = dayjs(row.original.rentalStartDate);
        if (!date.isValid()) return null;
        return date.format(DEFAULT_DATE_FORMAT);
      },
    },
    {
      accessorKey: 'rentalEndDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_rental_end_date')}
        />
      ),
      cell: ({ row }) => {
        const date = dayjs(row.original.rentalEndDate);
        if (!date.isValid()) return null;
        return date.format(DEFAULT_DATE_FORMAT);
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('contract_status')} />
      ),
      cell: ({ row }) => {
        const status =
          (row.original.status?.toLowerCase() as
            | 'pending'
            | 'active'
            | 'expired'
            | 'cancelled'
            | 'terminated'
            | 'hold') ?? 'pending';
        return <Badge>{t(`contract_s_${status}`)}</Badge>;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'approvalStatus',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_approval_status')}
        />
      ),
      cell: ({ row }) => {
        const status =
          (row.original.approvalStatus?.toLowerCase() as
            | 'pending'
            | 'approved'
            | 'rejected') ?? 'pending';
        return (
          <Badge
            variant={
              status === 'pending'
                ? 'warning'
                : status === 'approved'
                  ? 'success'
                  : 'destructive'
            }
          >
            {t(`contract_approval_${status}`)}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'depositStatus',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_deposit_status')}
        />
      ),
      cell: ({ row }) => {
        const status =
          (row.original.depositStatus?.toLowerCase() as
            | 'pending'
            | 'paid'
            | 'refunded'
            | 'deducted'
            | 'cancelled') ?? 'pending';
        return (
          <Badge
            variant={
              status === 'pending'
                ? 'warning'
                : status === 'paid'
                  ? 'success'
                  : 'destructive'
            }
          >
            {t(`contract_deposit_${status}`)}
          </Badge>
        );
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

  const filterFields: DataTableFilterField<ContractSchema>[] = [
    {
      label: t('contract_room'),
      value: 'roomId',
      placeholder: t('common_ph_select', {
        field: t('contract_room').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: contractData?.results || [],
    columns,
    pageCount: contractData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('contract_index_title')} pathname={pathname}>
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
            onDelete,
            onCreate,
          }}
          table={table}
          columns={columns}
          filterOptions={filterFields}
          loading={isFetching}
          moduleName="contract"
        />
      )}
    </ContentLayout>
  );
}
