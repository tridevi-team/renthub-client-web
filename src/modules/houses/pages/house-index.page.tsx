import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { houseRepositories } from '@modules/houses/apis/house.api';
import { housePath } from '@modules/houses/routes';
import {
  houseKeys,
  type HouseDataSchema,
  type HouseSchema,
  type HouseUpdateStatusResponseSchema,
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
import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row, Table } from '@tanstack/react-table';
import to from 'await-to-js';
import { FileEdit, View } from 'lucide-react';
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
    module: 'house',
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
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

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
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    onSuccess: () => {
      toast.success(t('ms_delete_house_success'));
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
    navigate(`${housePath.root}/${housePath.create}`);
  }, [navigate]);

  const onChangeStatusHouse = useCallback(
    async (ids: string[], status: boolean) => {
      setLoading(true);
      const [err, _]: AwaitToResult<HouseUpdateStatusResponseSchema> = await to(
        houseRepositories.changeStatus({
          ids,
          status,
        }),
      );
      setLoading(false);
      if (err) {
        if ('code' in err) {
          toast.error(t(err.code));
        } else {
          toast.error(t('UNKNOWN_ERROR'));
        }
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: houseKeys.list({}),
      });
      toast.success(t('ms_update_house_success'));
    },
    [t],
  );

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
        navigate(
          `${housePath.root}/${housePath.edit.replace(':id', row.original.id)}`,
        );
      },
    },
    {
      label: t('bt_preview'),
      icon: <View className="mr-2 h-4 w-4" />,
      onClick: (row: Row<HouseSchema>) => {
        navigate(
          `${housePath.root}/${housePath.preview.replace(':id', row.original.id)}`,
        );
      },
    },
    // {
    //   label: t('bt_delete'),
    //   icon: <Trash className="mr-2 h-4 w-4" />,
    //   isDanger: true,
    //   onClick: (row: Row<HouseSchema>) => onDelete([row.original]),
    // },
  ];

  const additionalActionButtons = (table: Table<HouseSchema>) => {
    const selectedItems = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);
    const ids = selectedItems.map((item) => item.id);
    return (
      ids?.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangeStatusHouse(ids, true)}
            disabled={loading}
          >
            {t('house_action_active')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChangeStatusHouse(ids, false)}
            disabled={loading}
          >
            {t('house_action_inactive')}
          </Button>
        </div>
      )
    );
  };

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
      placeholder: t('common_ph_input', {
        field: t('house_name').toLowerCase(),
      }),
    },
    {
      label: t('house_status'),
      value: 'status',
      placeholder: t('common_ph_select', {
        field: t('house_status').toLowerCase(),
      }),
      options: [
        { label: t('house_active'), value: '0' },
        { label: t('house_inactive'), value: '1' },
      ],
    },
  ];

  const { table } = useDataTable({
    data: houseData?.results || [],
    columns,
    pageCount: houseData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('house_index_title')} pathname={pathname}>
      {isInitialLoading ? (
        <DataTableSkeleton
          columnCount={5}
          filterableColumnCount={2}
          cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem']}
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
            // onDelete,
            onCreate,
          }}
          additionalActionButtons={additionalActionButtons}
          table={table}
          columns={columns}
          filterOptions={filterFields}
          loading={isFetching}
        />
      )}
    </ContentLayout>
  );
}
