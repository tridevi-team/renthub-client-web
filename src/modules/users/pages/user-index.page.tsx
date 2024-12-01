import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { userRepositories } from '@modules/users/apis/user.api';
import {
  userKeys,
  type UserIndexResponseSchema,
  type UserSchema,
} from '@modules/users/schema/user.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Checkbox } from '@shared/components/ui/checkbox';
import { DEFAULT_DATE_FORMAT } from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { FileEdit } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  redirect,
  useLocation,
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
  const [showDetailDialog, setShowDetailDialog] = useState(false);
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
    const searchParams = processSearchParams(params, 'users', {
      field: 'updatedAt',
      direction: 'asc',
    });
    const [err, resp]: AwaitToResult<UserIndexResponseSchema> = await to(
      userRepositories.index({ searchParams }),
    );
    if (err) {
      return {
        results: [],
        page: 1,
        pageCount: 1,
      };
    }
    return resp?.data;
  }, []);

  const {
    data: userData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: userKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<UserSchema>[] = [
    {
      label: t('bt_view_detail'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (_) => {
        setShowDetailDialog(true);
      },
    },
  ];

  const columns: ColumnDef<UserSchema>[] = [
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
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('auth_fullName')} />
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('auth_email')} />
      ),
    },
    {
      accessorKey: 'gender',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('auth_gender')} />
      ),
      cell: ({ row }) => {
        return row.original.gender === 'male'
          ? t('user_male')
          : t('user_female') || '';
      },
      enableSorting: true,
    },
    {
      accessorKey: 'birthday',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('user_dob')} />
      ),
      cell: ({ row }) => {
        return dayjs(row.original?.birthday ?? new Date().toISOString()).format(
          DEFAULT_DATE_FORMAT,
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('user_role')} />
      ),
      cell: ({ row }) => {
        return row.original.role || '';
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

  const filterFields: DataTableFilterField<UserSchema>[] = [
    {
      label: t('user_fullname'),
      value: 'fullName',
      placeholder: t('common_ph_input', {
        field: t('user_fullname').toLowerCase(),
      }),
    },
    {
      label: t('user_email'),
      value: 'email',
      placeholder: t('common_ph_input', {
        field: t('user_email').toLowerCase(),
      }),
    },
    {
      label: t('auth_gender'),
      value: 'gender',
      placeholder: t('common_ph_select', {
        field: t('auth_gender').toLowerCase(),
      }),
      options: [
        { label: t('user_male'), value: 'male' },
        { label: t('user_female'), value: 'female' },
      ],
    },
  ];

  const { table } = useDataTable({
    data: userData?.results || [],
    columns,
    pageCount: userData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('user_index_title')} pathname={pathname}>
      {isInitialLoading ? (
        <DataTableSkeleton
          columnCount={5}
          filterableColumnCount={2}
          cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem']}
          shrinkZero
        />
      ) : (
        <DataTable
          actions={{}}
          table={table}
          columns={columns}
          filterOptions={filterFields}
          loading={isFetching}
          moduleName="role"
        />
      )}
    </ContentLayout>
  );
}
