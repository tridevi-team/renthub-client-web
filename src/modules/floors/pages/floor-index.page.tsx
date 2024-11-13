import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { floorRepositories } from '@modules/floors/apis/floor.api';
import {
  floorKeys,
  type FloorDataSchema,
  type FloorSchema,
} from '@modules/floors/schema/floor.schema';
import { housePath } from '@modules/houses/routes';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import ErrorCard from '@shared/components/layout/error-section';
import { Checkbox } from '@shared/components/ui/checkbox';
import { DEFAULT_DATE_FORMAT } from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
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

  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const fetchData = useCallback(async (params: URLSearchParams) => {
    const searchParams = processSearchParams(params, 'floors');

    try {
      const response = await floorRepositories.index({ searchParams });
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
      toast.success(t('ms_delete_floor_success'));
      table.toggleAllRowsSelected(false);
      queryClient.invalidateQueries({ queryKey: floorKeys.list(queryParams) });
    },
    onError: () => {
      toast.error(t('ms_error'));
    },
  });

  const onDelete = useCallback(
    async (selectedItems: FloorSchema[]) => {
      const ids = selectedItems.map((item) => item.id);
      await deleteMutation.mutateAsync(ids);
    },
    [deleteMutation],
  );

  const onCreate = useCallback(() => {
    navigate(`${housePath.root}/${housePath.create}`);
  }, [navigate]);

  const {
    isError,
    data: houseData,
    isLoading,
    isFetching,
  } = useQuery<FloorDataSchema>({
    queryKey: floorKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<FloorSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: (row: Row<FloorSchema>) => {},
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<FloorSchema>) => onDelete([row.original]),
    },
  ];

  const columns: ColumnDef<FloorSchema>[] = [
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
        <DataTableColumnHeader column={column} title={t('floor_name')} />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('floor_description')} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('floor_created_at')} />
      ),
      cell: ({ row }) => {
        const date = dayjs(row.original.createdAt);
        if (!date.isValid()) return null;
        return date.format(DEFAULT_DATE_FORMAT);
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('floor_updated_at')} />
      ),
      cell: ({ row }) => {
        const date = dayjs(row.original.updatedAt);
        if (!date.isValid()) return null;
        return date.format(DEFAULT_DATE_FORMAT);
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

  const filterFields: DataTableFilterField<FloorSchema>[] = [
    {
      label: t('floor_name'),
      value: 'name',
      placeholder: t('common_ph_input', {
        field: t('floor_name').toLowerCase(),
      }),
    },
    {
      label: t('floor_description'),
      value: 'description',
      placeholder: t('common_ph_input', {
        field: t('floor_description').toLowerCase(),
      }),
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
    <ContentLayout title={t('floor_index_title')} pathname={pathname}>
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
              queryKey: floorKeys.list(queryParams),
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
          columnWidths={['2rem', '5rem', '27rem', '5rem', '9rem', '2rem']}
        />
      )}
    </ContentLayout>
  );
}
