import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { floorRepositories } from '@modules/floors/apis/floor.api';
import { FloorDialog } from '@modules/floors/components/floor-dialog';
import {
  floorKeys,
  type FloorCreateRequestSchema,
  type FloorCreateResponseSchema,
  type FloorDataSchema,
  type FloorDeleteResponseSchema,
  type FloorIndexResponseSchema,
  type FloorSchema,
} from '@modules/floors/schema/floor.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_RETURN_TABLE_DATA,
  PREFIX_FLOOR_NAME,
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
import { FileEdit, Trash } from 'lucide-react';
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
    module: 'floor',
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isShowFloorDialog, setIsShowFloorDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FloorSchema>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const fetchData = useCallback(async (params: URLSearchParams) => {
    const searchParams = processSearchParams(params, 'floors', {
      field: 'name',
      direction: 'asc',
    });
    const [err, resp]: AwaitToResult<FloorIndexResponseSchema> = await to(
      floorRepositories.index({ searchParams }),
    );
    if (err) return DEFAULT_RETURN_TABLE_DATA;
    return resp?.data || DEFAULT_RETURN_TABLE_DATA;
  }, []);

  const onDelete = useCallback(
    async (selectedItems: FloorSchema[]) => {
      const [err, _]: AwaitToResult<FloorDeleteResponseSchema> = await to(
        floorRepositories.deleteMany({
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
        queryKey: floorKeys.list(queryParams),
      });
      toast.success(t('ms_delete_floor_success'));
    },
    [t, queryParams],
  );

  const onClickCreateButton = useCallback(() => {
    setSelectedItem(undefined);
    setIsShowFloorDialog(true);
  }, []);

  const onCreate = useCallback(
    async (data: FloorCreateRequestSchema) => {
      setIsSubmitting(true);
      const [err, _]: AwaitToResult<FloorCreateResponseSchema> = await to(
        floorRepositories.create({
          floor: {
            ...data,
            name: `${PREFIX_FLOOR_NAME} ${data.name}`,
          },
        }),
      );
      setIsSubmitting(false);
      if (err) {
        if ('code' in err) {
          toast.error(t(err.code));
        } else {
          toast.error(t('UNKNOWN_ERROR'));
        }
        return;
      }
      setIsShowFloorDialog(false);
      await queryClient.invalidateQueries({
        queryKey: floorKeys.list(queryParams),
      });
      toast.success(t('ms_create_floor_success'));
    },
    [t, queryParams],
  );

  const onUpdate = useCallback(
    async (data: FloorSchema) => {
      if (!selectedItem) return;
      setIsSubmitting(true);
      const [err, _]: AwaitToResult<FloorCreateResponseSchema> = await to(
        floorRepositories.update({ id: selectedItem?.id, floor: {...data, name: "Tầng " + data.name} }),
      );
      setIsSubmitting(false);
      if (err) {
        if ('code' in err) {
          toast.error(t(err.code));
        } else {
          toast.error(t('UNKNOWN_ERROR'));
        }
        return;
      }
      setIsShowFloorDialog(false);
      await queryClient.invalidateQueries({
        queryKey: floorKeys.list(queryParams),
      });
      toast.success(t('ms_update_floor_success'));
    },
    [t, queryParams, selectedItem],
  );

  const {
    data: floorData,
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
      onClick: async (row: Row<FloorSchema>) => {
        setSelectedItem(row.original);
        setIsShowFloorDialog(true);
      },
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
      cell: ({ row }) => {
        return <p className="line-clamp-1">{row.original.description}</p>;
      },
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
    data: floorData?.results || [],
    columns,
    pageCount: floorData?.pageCount || 0,
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
      ) : (
        <>
          <DataTable
            actions={{
              onDelete,
              onCreate: onClickCreateButton,
            }}
            table={table}
            columns={columns}
            filterOptions={filterFields}
            loading={isFetching}
            columnWidths={['2rem', '9rem', '27rem']}
            moduleName="floor"
          />

          <FloorDialog
            isOpen={isShowFloorDialog}
            onClose={() => setIsShowFloorDialog(false)}
            onCreate={onCreate}
            onUpdate={onUpdate}
            initialData={selectedItem}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </ContentLayout>
  );
}
