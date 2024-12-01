import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { equipmentRepositories } from '@modules/equipments/apis/equipment.api';
import { equipmentPath } from '@modules/equipments/routes';
import {
  equipmentKeys,
  type EquipmentSchema,
} from '@modules/equipments/schema/equiment.schema';
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
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import to from 'await-to-js';
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
    module: 'equipment',
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
    const searchParams = processSearchParams(params, 'equipment', {
      field: 'updatedAt',
      direction: 'desc',
    });

    const [err, result] = await to(
      equipmentRepositories.index({ searchParams }),
    );
    if (err) {
      return {
        results: [],
        pageCount: 0,
      };
    }
    return result?.data;
  }, []);

  const onDelete = useCallback(
    async (selectedItems: EquipmentSchema[]) => {
      const [err, _]: AwaitToResult<any> = await to(
        equipmentRepositories.deleteMany({
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
        queryKey: equipmentKeys.list(queryParams),
      });
      toast.success(t('ms_delete_equipment_success'));
      return _;
    },
    [t, queryParams],
  );

  const onDestroy = useCallback(
    async (id: string) => {
      const [err, _]: AwaitToResult<any> = await to(
        equipmentRepositories.delete({ id }),
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
        queryKey: equipmentKeys.list(queryParams),
      });
      toast.success(t('ms_delete_equipment_success'));
      return _;
    },
    [t, queryParams],
  );

  const onCreate = useCallback(() => {
    navigate(`${equipmentPath.root}/${equipmentPath.create}`);
  }, [navigate]);

  const {
    data: equipmentData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: equipmentKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<EquipmentSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<EquipmentSchema>) => {
        navigate(
          `${equipmentPath.root}/${equipmentPath.edit.replace(':id', row.original.id)}`,
        );
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<EquipmentSchema>) => onDestroy(row.original.id),
    },
  ];

  const columns: ColumnDef<EquipmentSchema>[] = [
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
        <DataTableColumnHeader column={column} title={t('equipment_name')} />
      ),
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('equipment_code')} />
      ),
    },
    {
      accessorKey: 'floorName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('equipment_floor')} />
      ),
    },
    {
      accessorKey: 'roomName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('equipment_room')} />
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('equipment_description')}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('equipment_status')} />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="outline">
            {t(
              `equipment_status_${row.original.status?.toLowerCase() as 'normal' | 'broken' | 'repairing' | 'disposed'}`,
            )}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'sharedType',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('equipment_shared_type')}
        />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="outline">
            {t(
              `equipment_shared_type_${row.original.sharedType?.toLowerCase() as 'house' | 'room'}`,
            )}
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

  const filterFields: DataTableFilterField<EquipmentSchema>[] = [
    {
      label: t('equipment_name'),
      value: 'name',
      placeholder: t('common_ph_input', {
        field: t('equipment_name').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: equipmentData?.results || [],
    columns,
    pageCount: equipmentData?.pageCount || 0,
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
          moduleName="equipment"
        />
      )}
    </ContentLayout>
  );
}
