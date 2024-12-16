import { updateSignupInfoStatus } from '@app/firebase';
import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import {
  notificationKeys,
  notificationRepositories,
} from '@shared/apis/notification.api';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Badge } from '@shared/components/ui/badge';
import { Checkbox } from '@shared/components/ui/checkbox';
import { DEFAULT_RETURN_TABLE_DATA } from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { FilePenIcon, Phone } from 'lucide-react';
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
    module: 'notification',
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
  const [_, setPrefillContractForm] = useLocalStorageState(
    'prefill-contract-form',
    {
      defaultValue: {} as Record<string, any>,
    },
  );
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
    const searchParams = processSearchParams(params, 'notifications', {
      field: 'updatedAt',
      direction: 'desc',
    });

    const [err, result]: AwaitToResult<any> = await to(
      notificationRepositories.index({ searchParams }),
    );
    if (err || !result) {
      return DEFAULT_RETURN_TABLE_DATA;
    }
    return result?.data;
  }, []);

  const {
    data: notificationData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: notificationKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const columns: ColumnDef<any>[] = [
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
        <DataTableColumnHeader
          column={column}
          title={t('notification_fullname')}
        />
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('notification_phone')}
        />
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('notification_email')}
        />
      ),
    },
    {
      accessorKey: 'roomName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('notification_room_name')}
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('notification_created_at')}
        />
      ),
      cell: ({ row }) => {
        const { seconds } = row.original.createdAt;
        return dayjs.unix(seconds).format('DD/MM/YYYY HH:mm');
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('notification_status')}
        />
      ),
      cell: ({ row }) => {
        const status =
          (row.original.status?.toLowerCase() as 'waiting_for_contact') ??
          'waiting_for_contact';
        return (
          <Badge
            variant={status === 'waiting_for_contact' ? 'warning' : 'success'}
          >
            {t(`notification_status_${status}`)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('notification_action')}
        />
      ),
      cell: ({ row }) => {
        const id = row.original.id;
        const canCreateContract =
          checkPermissionPage({
            module: 'contract',
            action: 'create',
          }) && row.original.status === 'WAITING_FOR_CONTACT';
        if (!canCreateContract) {
          return null;
        }
        return (
          <div className="flex items-center justify-center space-x-2">
            <FilePenIcon
              className="h-5 hover:cursor-pointer hover:text-primary"
              onClick={() => {
                setPrefillContractForm({
                  notificationId: id,
                  renter: {
                    fullName: row.original.fullName,
                    phoneNumber: row.original.phoneNumber,
                    email: row.original.email,
                  },
                });
                navigate('/contracts/create');
              }}
            />
            <Phone
              className="h-5 hover:cursor-pointer hover:text-primary"
              onClick={async () => {
                await updateSignupInfoStatus(id, 'CONTACTED');
                await queryClient.invalidateQueries();
                toast.success(t('notification_contacted'));
              }}
            />
          </div>
        );
      },
    },
  ];

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: t('notification_title'),
      value: 'title',
      placeholder: t('common_ph_input', {
        field: t('notification_title').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: notificationData?.results || [],
    columns,
    pageCount: notificationData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('notification_index_title')} pathname={pathname}>
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
          moduleName="notification"
        />
      )}
    </ContentLayout>
  );
}
