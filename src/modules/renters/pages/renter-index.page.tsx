import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { renterRepositories } from '@modules/renters/apis/renter.api';
import { renterPath } from '@modules/renters/routes';
import {
  renterKeys,
  type RenterSchema,
} from '@modules/renters/schema/renter.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Checkbox } from '@shared/components/ui/checkbox';
import { DEFAULT_RETURN_TABLE_DATA } from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Tag, Tooltip } from 'antd';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { Check, FileEdit, KeyRound, Trash, UserRoundX } from 'lucide-react';
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
    module: 'renter',
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
    const searchParams = processSearchParams(params, 'renters', {
      field: 'updatedAt',
      direction: 'desc',
    });

    const [err, result] = await to(
      renterRepositories.listByHouse({ searchParams }),
    );
    if (err) {
      return DEFAULT_RETURN_TABLE_DATA;
    }
    return result?.data;
  }, []);

  const onDelete = useCallback(
    async (selectedItems: RenterSchema[]) => {
      const [err, _]: AwaitToResult<any[]> = await to(
        Promise.all(
          selectedItems.map((item) =>
            renterRepositories.delete({ id: item.id }),
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
        queryKey: renterKeys.list(queryParams),
      });
      toast.success(t('ms_delete_renter_success'));
      return;
    },
    [t, queryParams],
  );

  const onDestroy = useCallback(
    async (id: string) => {
      const [err, _]: AwaitToResult<any> = await to(
        renterRepositories.delete({ id }),
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
        queryKey: renterKeys.list(queryParams),
      });
      toast.success(t('ms_delete_renter_success'));
      return _;
    },
    [t, queryParams],
  );

  const onCreate = useCallback(() => {
    navigate(`${renterPath.root}/${renterPath.create}`);
  }, [navigate]);

  const {
    data: renterData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: renterKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<RenterSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<RenterSchema>) => {
        navigate(
          `${renterPath.root}/${renterPath.edit.replace(':id', row.original.id)}`,
        );
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<RenterSchema>) => onDestroy(row.original.id),
    },
  ];

  const genderToPresetTag = useMemo(
    () => ({
      male: 'geekblue',
      female: 'magenta',
      other: '',
    }),
    [],
  );

  const columns: ColumnDef<RenterSchema>[] = [
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
      accessorKey: 'renterName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('renter_name')} />
      ),
      cell: ({ row }) => {
        const name = row.original.renterName || row.original.name || '';
        const gender = row.original.gender as 'male' | 'female' | 'other';
        const genderString = t(`renter_${gender}`);
        return (
          <p className="flex items-center">
            {name}{' '}
            <Tag
              bordered={false}
              color={genderToPresetTag[gender]}
              className="ml-2"
            >
              {genderString}
            </Tag>
          </p>
        );
      },
    },
    {
      accessorKey: 'birthday',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('renter_birthday')} />
      ),
      cell: ({ row }) => {
        const date = row.original.birthday;
        if (!date) return '';
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      accessorKey: 'renter_temp_reg',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('renter_temp_reg')} />
      ),
      cell: ({ row }) => {
        const isTempReg = row.original.tempReg;
        return (
          <Tooltip
            title={
              isTempReg ? t('renter_temp_reg_yes') : t('renter_temp_reg_no')
            }
            arrow={false}
            className="ml-5"
          >
            {isTempReg ? (
              <Check className="h-5" />
            ) : (
              <UserRoundX className="h-5" />
            )}
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'floorName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('renter_floor')} />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'roomName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('renter_room')} />
      ),
      cell: ({ row }) => {
        const isRepresent = row.original.represent;
        const roomName = row.original.roomName || '';
        return (
          <p className="flex items-center">
            {roomName}{' '}
            {isRepresent ? (
              <Tooltip title={t('renter_represent')} arrow={false}>
                <KeyRound className="h-3" />
              </Tooltip>
            ) : null}
          </p>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('renter_phone_number')}
        />
      ),
    },
    {
      accessorKey: 'moveInDate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('renter_move_in_date')}
        />
      ),
      cell: ({ row }) => {
        const date = row.original.moveInDate;
        if (!date) return '';
        return dayjs(date).format('DD/MM/YYYY');
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

  const filterFields: DataTableFilterField<RenterSchema>[] = [
    {
      label: t('renter_name'),
      value: 'renterName',
      placeholder: t('common_ph_input', {
        field: t('renter_name').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: renterData?.results || [],
    columns,
    pageCount: renterData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('equipment_index_title')} pathname={pathname}>
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
          moduleName="renter"
        />
      )}
    </ContentLayout>
  );
}
