import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { floorKeys } from '@modules/floors/schema/floor.schema';
import { roleRepositories } from '@modules/roles/apis/role.api';
import { rolePath } from '@modules/roles/routes';
import {
  roleKeys,
  type RoleDataSchema,
  type RoleDeleteResponseSchema,
  type RoleSchema,
} from '@modules/roles/schema/role.schema';
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
import { DEFAULT_DATE_FORMAT } from '@shared/constants/general.constant';
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
    module: 'role',
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
    const searchParams = processSearchParams(params, 'roles', {
      field: 'updatedAt',
      direction: 'asc',
    });

    try {
      const response = await roleRepositories.index({ searchParams });
      return response.data || null;
    } catch (error) {
      console.log('error:', error);
      return Promise.reject(error);
    }
  }, []);

  const onDelete = useCallback(
    async (selectedItems: RoleSchema[]) => {
      const [err, _]: AwaitToResult<RoleDeleteResponseSchema> = await to(
        roleRepositories.deleteMany({
          ids: selectedItems.map((item) => item.id),
        }),
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
        queryKey: roleKeys.list(queryParams),
      });
      toast.success(t('ms_delete_floor_success'));
    },
    [t, queryParams],
  );

  const onClickCreateButton = useCallback(() => {
    navigate(`${rolePath.root}/${rolePath.create}`);
  }, [navigate]);

  const {
    isError,
    data: roleData,
    isLoading,
    isFetching,
  } = useQuery<RoleDataSchema>({
    queryKey: roleKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<RoleSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<RoleSchema>) => {
        navigate(
          `${rolePath.root}/${rolePath.edit.replace(':id', row.original.id)}`,
        );
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<RoleSchema>) => onDelete([row.original]),
    },
  ];

  const columns: ColumnDef<RoleSchema>[] = [
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
        <DataTableColumnHeader column={column} title={t('role_name')} />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('role_description')} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('role_created_at')} />
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
        <DataTableColumnHeader column={column} title={t('role_updated_at')} />
      ),
      cell: ({ row }) => {
        const date = dayjs(row.original.updatedAt);
        if (!date.isValid()) return null;
        return date.format(DEFAULT_DATE_FORMAT);
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('role_status')} />
      ),
      cell: ({ row }) => {
        return row.original.status === 0 ? (
          <Badge variant="outline">{t('role_inactive')}</Badge>
        ) : (
          <Badge variant="outline">{t('role_active')}</Badge>
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

  const filterFields: DataTableFilterField<RoleSchema>[] = [
    {
      label: t('role_name'),
      value: 'name',
      placeholder: t('common_ph_input', {
        field: t('role_name').toLowerCase(),
      }),
    },
    {
      label: t('role_description'),
      value: 'description',
      placeholder: t('common_ph_input', {
        field: t('role_description').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: roleData?.results || [],
    columns,
    pageCount: roleData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('role_index_title')} pathname={pathname}>
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
            onCreate: onClickCreateButton,
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
