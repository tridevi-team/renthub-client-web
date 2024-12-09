import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { contractTemplateRepositories } from '@modules/contract-templates/api/contract-template.api';
import { contractTemplatePath } from '@modules/contract-templates/routes';
import {
  contractTemplateKeys,
  type ContractTemplateDeleteResponseSchema,
  type ContractTemplateSchema,
} from '@modules/contract-templates/schemas/contract-template.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ScrollableDiv } from '@shared/components/extensions/scrollable-div';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Badge } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import {
  DEFAULT_RETURN_TABLE_DATA,
  DOM_PURIFY_ALLOWED_ATTR,
  DOM_PURIFY_ALLOWED_TAGS,
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
import DOMPurify from 'dompurify';
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
    module: 'contract',
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
    const searchParams = processSearchParams(params, 'contract_template', {
      field: 'updatedAt',
      direction: 'desc',
    });

    const [err, result] = await to(
      contractTemplateRepositories.index({ searchParams }),
    );
    if (err) {
      return DEFAULT_RETURN_TABLE_DATA;
    }
    return result?.data;
  }, []);

  const onDelete = useCallback(
    async (selectedItems: ContractTemplateSchema[]) => {
      const [err, _]: AwaitToResult<ContractTemplateDeleteResponseSchema[]> =
        await to(
          Promise.all(
            selectedItems.map((item) =>
              contractTemplateRepositories.delete({ id: item.id }),
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
        queryKey: contractTemplateKeys.list(queryParams),
      });
      toast.success(t('ms_delete_contract_template_success'));
      return;
    },
    [t, queryParams],
  );

  const onDestroy = useCallback(
    async (id: string) => {
      const [err, _]: AwaitToResult<ContractTemplateDeleteResponseSchema> =
        await to(contractTemplateRepositories.delete({ id }));
      if (err) {
        if ('code' in err) {
          toast.error(t(err.code));
        } else {
          toast.error(t('UNKNOWN_ERROR'));
        }
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: contractTemplateKeys.list(queryParams),
      });
      toast.success(t('ms_delete_contract_template_success'));
      return;
    },
    [t, queryParams],
  );

  const onCreate = useCallback(() => {
    navigate(`${contractTemplatePath.root}/${contractTemplatePath.create}`);
  }, [navigate]);

  const {
    data: contractTemplateData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: contractTemplateKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<ContractTemplateSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<ContractTemplateSchema>) => {
        navigate(
          `${contractTemplatePath.root}/${contractTemplatePath.edit.replace(':id', row.original.id)}`,
        );
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<ContractTemplateSchema>) => onDestroy(row.original.id),
    },
  ];

  const ContentModal = ({ content }: { content: string }) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: DOM_PURIFY_ALLOWED_TAGS,
      ALLOWED_ATTR: DOM_PURIFY_ALLOWED_ATTR,
    });

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="p-0 text-left">
            {t('bt_view_detail')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('contract_t_content')}</DialogTitle>
          </DialogHeader>
          <ScrollableDiv className="max-h-[60vh] overflow-y-auto px-4 md:px-0">
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              className="prose dark:prose-invert max-w-none"
            />
          </ScrollableDiv>
        </DialogContent>
      </Dialog>
    );
  };

  const columns: ColumnDef<ContractTemplateSchema>[] = [
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
        <DataTableColumnHeader column={column} title={t('contract_t_name')} />
      ),
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_t_isActive')}
        />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.isActive ? 'success' : 'destructive'}>
            {row.original.isActive
              ? t('contract_t_isActive_true')
              : t('contract_t_isActive_false')}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_t_created_at')}
        />
      ),
      cell: ({ row }) => {
        return dayjs(row.original.createdAt).format('DD/MM/YYYY');
      },
      enableSorting: true,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_t_updated_at')}
        />
      ),
      cell: ({ row }) => {
        return dayjs(row.original.updatedAt).format('DD/MM/YYYY');
      },
      enableSorting: true,
    },
    {
      accessorKey: 'content',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('contract_t_content')}
        />
      ),
      cell: ({ row }) => {
        return <ContentModal content={row.original.content} />;
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

  const filterFields: DataTableFilterField<ContractTemplateSchema>[] = [
    {
      label: t('contract_t_name'),
      value: 'name',
      placeholder: t('common_ph_input', {
        field: t('contract_t_name').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: contractTemplateData?.results || [],
    columns,
    pageCount: contractTemplateData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('contract_t_index_title')} pathname={pathname}>
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
          moduleName="contract"
        />
      )}
    </ContentLayout>
  );
}
