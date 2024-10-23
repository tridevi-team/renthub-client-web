import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { houseRepositories } from '@modules/houses/apis/house.api';
import { housePath } from '@modules/houses/routes';
import {
  houseKeys,
  type HouseDataSchema,
  type HouseSchema,
} from '@modules/houses/schema/house.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import ErrorCard from '@shared/components/layout/error-section';
import { Badge } from '@shared/components/ui/badge';
import { Checkbox } from '@shared/components/ui/checkbox';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { FileEdit, Trash } from 'lucide-react';
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

  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [searchParams, _] = useSearchParams();
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
    const searchParams = processSearchParams(params, 'houses');

    try {
      const response = await houseRepositories.index({ searchParams });
      return response.data || null;
    } catch (error) {
      return Promise.reject(error);
    }
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      console.log('ids:', ids);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    onSuccess: () => {
      toast.success(t('ms_deleteHouseSuccess'));
      table.toggleAllRowsSelected(false);
      queryClient.invalidateQueries({ queryKey: houseKeys.list(queryParams) });
    },
    onError: () => {
      toast.error(t('ms_error'));
    },
  });

  const onDelete = useCallback(
    async (selectedItems: HouseSchema[]) => {
      const ids = selectedItems.map((item) => item.id);
      await deleteMutation.mutateAsync(ids);
    },
    [deleteMutation],
  );

  const onCreate = useCallback(() => {
    navigate(housePath.create);
  }, [navigate]);

  const {
    isError,
    data: houseData,
    isLoading,
    isFetching,
  } = useQuery<HouseDataSchema>({
    queryKey: houseKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<HouseSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: (row: Row<HouseSchema>) => {
        navigate(housePath.edit.replace(':id', row.original.id));
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<HouseSchema>) => onDelete([row.original]),
    },
  ];

  const columns: ColumnDef<HouseSchema>[] = [
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('house_name')} />
      ),
    },
    {
      accessorKey: 'address.street',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('house_street')} />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'address.ward',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('house_ward')} />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'address.district',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('house_district')} />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'address.city',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('house_city')} />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('house_status')} />
      ),
      cell: ({ row }) => {
        return row.original.status === 0 ? (
          <Badge variant="outline">{t('house_status_inactive')}</Badge>
        ) : (
          <Badge variant="outline">{t('house_status_active')}</Badge>
        );
      },
      enableSorting: true,
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

  const filterFields: DataTableFilterField<HouseSchema>[] = [
    {
      label: t('house_name'),
      value: 'name',
      placeholder: 'Nhập tên nhà trọ',
    },
    {
      label: t('house_status'),
      value: 'status',
      placeholder: 'Chọn trạng thái',
      options: [
        { label: 'active', value: '0' },
        { label: 'inactive', value: '1' },
      ],
    },
  ];

  const { table } = useDataTable({
    data: houseData?.results || [],
    columns,
    pageCount: houseData?.pageCount || 0,
    filterFields,
    initialState: {
      // columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('house_index_title')} pathname={pathname}>
      {isInitialLoading ? (
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
          shrinkZero
        />
      ) : isError ? (
        <ErrorCard
          onRetry={() =>
            queryClient.refetchQueries({
              queryKey: houseKeys.list(queryParams),
            })
          }
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
        />
      )}
    </ContentLayout>
  );
}
