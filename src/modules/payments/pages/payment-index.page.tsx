import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { paymentRepositories } from '@modules/payments/apis/payment.api';
import { PaymentDialog } from '@modules/payments/components/payment-dialog';
import {
  paymentMethodKeys,
  type PaymentMethodCreateRequestSchema,
  type PaymentMethodCreateResponseSchema,
  type PaymentMethodDeleteResponseSchema,
  type PaymentMethodSchema,
  type PaymentMethodUpdateRequestSchema,
  type PaymentMethodUpdateResponseSchema,
} from '@modules/payments/schema/payment.schema';
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
import { BANKS } from '@shared/constants/bank.constant';
import { DEFAULT_RETURN_TABLE_DATA } from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Tooltip } from 'antd';
import to from 'await-to-js';
import { Check, FileEdit, Trash } from 'lucide-react';
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
    module: 'payment',
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
  const [isShowPaymentDialog, setIsShowPaymentDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentMethodSchema>();
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
    const searchParams = processSearchParams(params, 'paymentMethods', {
      field: 'updatedAt',
      direction: 'desc',
    });

    const [err, result] = await to(paymentRepositories.index({ searchParams }));
    if (err) {
      return DEFAULT_RETURN_TABLE_DATA;
    }
    return result?.data;
  }, []);

  const onDelete = useCallback(
    async (selectedItems: PaymentMethodSchema[]) => {
      const [err, _]: AwaitToResult<PaymentMethodDeleteResponseSchema[]> =
        await to(
          Promise.all(
            selectedItems.map((item) =>
              paymentRepositories.delete({ id: item.id }),
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
        queryKey: paymentMethodKeys.list(queryParams),
      });
      toast.success(t('ms_delete_payment_success'));
      return;
    },
    [t, queryParams],
  );

  const onDestroy = useCallback(
    async (id: string) => {
      const [err, _]: AwaitToResult<PaymentMethodDeleteResponseSchema> =
        await to(paymentRepositories.delete({ id }));
      if (err) {
        if ('code' in err) {
          toast.error(t(err.code));
        } else {
          toast.error(t('UNKNOWN_ERROR'));
        }
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: paymentMethodKeys.list(queryParams),
      });
      toast.success(t('ms_delete_payment_success'));
      return;
    },
    [t, queryParams],
  );

  const onCreate = useCallback(
    async (value: PaymentMethodCreateRequestSchema) => {
      setIsSubmitting(true);
      const { status, isDefault } = value;
      const [err, resp]: AwaitToResult<PaymentMethodCreateResponseSchema> =
        await to(
          paymentRepositories.create({
            ...value,
            status: !!status,
            isDefault: !!isDefault,
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
      setIsShowPaymentDialog(false);
      await queryClient.invalidateQueries({
        queryKey: paymentMethodKeys.list(queryParams),
      });
      toast.success(t('ms_create_payment_success'));
      return resp;
    },
    [t, queryParams],
  );

  const onUpdate = useCallback(
    async (value: PaymentMethodUpdateRequestSchema) => {
      console.log('selectedItem', selectedItem);
      if (!selectedItem) return;
      setIsSubmitting(true);
      const [err, resp]: AwaitToResult<PaymentMethodUpdateResponseSchema> =
        await to(
          paymentRepositories.update({
            id: selectedItem?.id,
            payment: {
              ...value,
              status: !!value.status,
              isDefault: !!value.isDefault,
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
      setIsShowPaymentDialog(false);
      await queryClient.invalidateQueries({
        queryKey: paymentMethodKeys.list(queryParams),
      });
      toast.success(t('ms_update_payment_success'));
      return resp;
    },
    [t, queryParams, selectedItem],
  );

  const onClickCreateButton = useCallback(() => {
    setIsShowPaymentDialog(true);
  }, []);

  const {
    data: paymentData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: paymentMethodKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<PaymentMethodSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<PaymentMethodSchema>) => {
        setSelectedItem(row.original);
        setIsShowPaymentDialog(true);
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<PaymentMethodSchema>) => onDestroy(row.original.id),
    },
  ];

  const columns: ColumnDef<PaymentMethodSchema>[] = [
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
        <DataTableColumnHeader column={column} title={t('payment_name')} />
      ),
    },
    {
      accessorKey: 'accountNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('payment_account_number')}
        />
      ),
    },
    {
      accessorKey: 'bankName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('payment_bank_name')} />
      ),
    },
    {
      accessorKey: 'bankLogo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('payment_bank_logo')} />
      ),
      cell: ({ row }) => {
        const bankName = row.original.bankName;
        const logo = BANKS.find((bank) => bank.shortName === bankName)?.logo;
        return logo ? (
          <img src={logo} alt={bankName} className="h-12 object-contain" />
        ) : null;
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('payment_status')} />
      ),
      cell: ({ row }) => (
        <Badge variant={row.original.status === 1 ? 'success' : 'outline'}>
          {row.original.status === 1
            ? t('payment_using')
            : t('payment_not_using')}
        </Badge>
      ),
    },
    {
      accessorKey: 'isDefault',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('payment_is_default')}
        />
      ),
      cell: ({ row }) => {
        const isDefault = row.original.isDefault;
        return isDefault ? (
          <Tooltip
            title={isDefault ? t('common_yes') : t('common_no')}
            arrow={false}
          >
            <Check />
          </Tooltip>
        ) : null;
      },
    },
    {
      accessorKey: 'payosClientId',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('payment_payos_status')}
        />
      ),
      cell: ({ row }) => {
        const isPayOS = row.original.payosClientId;
        return isPayOS ? (
          <Tooltip
            title={isPayOS ? t('payment_linked') : t('payment_not_linked')}
            arrow={false}
          >
            <Check />
          </Tooltip>
        ) : null;
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

  const filterFields: DataTableFilterField<PaymentMethodSchema>[] = [
    {
      label: t('payment_name'),
      value: 'name',
      placeholder: t('common_ph_input', {
        field: t('payment_name').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: paymentData?.results || [],
    columns,
    pageCount: paymentData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('payment_index_title')} pathname={pathname}>
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
            onCreate: onClickCreateButton,
          }}
          table={table}
          columns={columns}
          filterOptions={filterFields}
          loading={isFetching}
          moduleName="payment"
        />
      )}
      <PaymentDialog
        isOpen={isShowPaymentDialog}
        onClose={() => {
          unstable_batchedUpdates(() => {
            setIsShowPaymentDialog(false);
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
