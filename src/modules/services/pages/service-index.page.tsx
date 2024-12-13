import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { serviceRepositories } from '@modules/services/apis/service.api';
import { ServiceDialog } from '@modules/services/components/service-dialog';
import type {
  ServiceCreateRequestSchema,
  ServiceCreateResponseSchema,
  ServiceDataSchema,
  ServiceDeleteResponseSchema,
  ServiceSchema,
  ServiceUpdateRequestSchema,
} from '@modules/services/schema/service.schema';
import { serviceKeys } from '@modules/services/schema/service.schema';
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
import { DEFAULT_RETURN_TABLE_DATA } from '@shared/constants/general.constant';
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
import { unstable_batchedUpdates } from 'react-dom';
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
    module: 'service',
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
  const [selectedItem, setSelectedItem] = useState<ServiceSchema>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isShowServiceDialog, setIsShowServiceDialog] = useState(false);

  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const fetchData = useCallback(async (params: URLSearchParams) => {
    const searchParams = processSearchParams(params, 'services', {
      field: 'updatedAt',
      direction: 'desc',
    });

    const [err, result] = await to(serviceRepositories.index({ searchParams }));
    if (err) return DEFAULT_RETURN_TABLE_DATA;
    return result?.data;
  }, []);

  const onDelete = useCallback(
    async (selectedItems: ServiceSchema[]) => {
      if (!selectedItems.length) return;
      const [err, _]: AwaitToResult<ServiceDeleteResponseSchema[]> = await to(
        Promise.all(
          selectedItems.map((item) =>
            serviceRepositories.delete({ id: item.id }),
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
        queryKey: serviceKeys.list(queryParams),
      });
      toast.success(t('ms_delete_service_success'));
      return;
    },
    [t, queryParams],
  );

  const onDestroy = useCallback(
    async (id: string) => {
      const [err, _]: AwaitToResult<ServiceDeleteResponseSchema> = await to(
        serviceRepositories.delete({ id }),
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
        queryKey: serviceKeys.list(queryParams),
      });
      toast.success(t('ms_delete_service_success'));
      return;
    },
    [t, queryParams],
  );

  const onCreate = useCallback(async (values: ServiceCreateRequestSchema) => {
    setIsSubmitting(true);
    const [err, resp]: AwaitToResult<ServiceCreateResponseSchema> = await to(
      serviceRepositories.create({ service: values }),
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
    setIsShowServiceDialog(false);
    toast.success(t('ms_create_service_success'));
    await queryClient.invalidateQueries({
      queryKey: serviceKeys.list(queryParams),
    });
    return resp;
  }, []);

  const onUpdate = useCallback(
    async (values: ServiceUpdateRequestSchema) => {
      if (!selectedItem) return;
      setIsSubmitting(true);
      const [err, resp]: AwaitToResult<ServiceCreateResponseSchema> = await to(
        serviceRepositories.update({ id: selectedItem?.id, service: values }),
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
      setIsShowServiceDialog(false);
      toast.success(t('ms_update_service_success'));
      await queryClient.invalidateQueries({
        queryKey: serviceKeys.list(queryParams),
      });
      return resp;
    },
    [t, selectedItem, queryParams],
  );

  const onClickCreateButton = useCallback(() => {
    setIsShowServiceDialog(true);
  }, []);

  const {
    data: serviceData,
    isLoading,
    isFetching,
  } = useQuery<ServiceDataSchema>({
    queryKey: serviceKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const mesureMap = useMemo(
    () => ({
      people: t('service_type_people'),
      room: t('service_type_room'),
      water_consumption: t('service_type_index'),
      electricity_consumption: t('service_type_index'),
    }),
    [t],
  );

  const actionColumn: Action<ServiceSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<ServiceSchema>) => {
        unstable_batchedUpdates(() => {
          setIsShowServiceDialog(true);
          setSelectedItem(row.original);
        });
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<ServiceSchema>) => onDestroy(row.original.id),
    },
  ];

  const columns: ColumnDef<ServiceSchema>[] = [
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
        <DataTableColumnHeader column={column} title={t('service_name')} />
      ),
    },
    {
      accessorKey: 'unitPrice',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('service_unit_price')}
        />
      ),
      cell: ({ row }) => {
        const formattedUnitPrice = row.original.unitPrice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${formattedUnitPrice} đ`;
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('service_cal_by')} />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="outline">
            {
              mesureMap[
                row.original.type?.toLocaleLowerCase() as keyof typeof mesureMap
              ]
            }
          </Badge>
        );
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('service_description')}
        />
      ),
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

  const filterFields: DataTableFilterField<ServiceSchema>[] = [
    {
      label: t('service_name'),
      value: 'name',
      placeholder: t('common_ph_input', {
        field: t('service_name').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: serviceData?.results || [],
    columns,
    pageCount: serviceData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('service_index_title')} pathname={pathname}>
      {isInitialLoading ? (
        <DataTableSkeleton
          columnCount={5}
          filterableColumnCount={2}
          // cellWidths={['10rem', '10rem', '10rem', '10rem', '10rem']}
          shrinkZero
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
          moduleName="service"
        />
      )}
      <ServiceDialog
        isOpen={isShowServiceDialog}
        onClose={() => {
          unstable_batchedUpdates(() => {
            setIsShowServiceDialog(false);
            setSelectedItem(undefined);
          });
        }}
        onCreate={onCreate}
        onUpdate={onUpdate}
        initialData={selectedItem}
        isSubmitting={isSubmitting}
      />
    </ContentLayout>
  );
}
