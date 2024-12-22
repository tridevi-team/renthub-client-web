import { queryClient } from '@app/providers/query/client';
import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { issueRepositories } from '@modules/issues/apis/issue.api';
import { ImageVideoCarousel } from '@modules/issues/components/image-video-carousel';
import { UpdateIssueStatusDialog } from '@modules/issues/components/update-status-dialog';
import {
  issueKeys,
  type IssueDeleteManyResponseSchema,
  type IssueDeleteResponseSchema,
  type IssueSchema,
} from '@modules/issues/schema/issue.schema';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import {
  DEFAULT_RETURN_TABLE_DATA,
  ISSUE_STATUS_OPTIONS,
} from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { processSearchParams } from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Space, Tooltip } from 'antd';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { FileEdit, ImageIcon, Trash } from 'lucide-react';
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
    module: 'issue',
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [isShowUpdateStatusDialog, setIsShowUpdateStatusDialog] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IssueSchema | null>(
    null,
  );
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
    const searchParams = processSearchParams(params, 'issues', {
      field: 'updatedAt',
      direction: 'desc',
    });

    const [err, result] = await to(issueRepositories.index({ searchParams }));
    if (err) {
      return DEFAULT_RETURN_TABLE_DATA;
    }
    return result?.data;
  }, []);

  const onDestroy = useCallback(
    async (id: string) => {
      const [err, _]: AwaitToResult<IssueDeleteResponseSchema> = await to(
        issueRepositories.delete({ id }),
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
        queryKey: issueKeys.list(queryParams),
      });
      toast.success(t('ms_delete_issue_success'));
      return;
    },
    [t, queryParams],
  );

  const onDelete = useCallback(
    async (selectedItems: IssueSchema[]) => {
      const [err, _]: AwaitToResult<IssueDeleteManyResponseSchema> = await to(
        issueRepositories.deleteMany({
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
        queryKey: issueKeys.list(queryParams),
      });
      toast.success(t('ms_delete_issue_success'));
      return;
    },
    [t, queryParams],
  );

  const updateIssueStatus = useCallback(
    async (data: any) => {
      setIsSubmitting(true);
      const [err, _]: AwaitToResult<any> = await to(
        issueRepositories.updateStatus({
          id: selectedRecord?.id ?? '',
          status: data.status,
          description: data.description,
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
      await queryClient.invalidateQueries({
        queryKey: issueKeys.list(queryParams),
      });
      toast.success(t('ms_update_issue_success'));
      setIsShowUpdateStatusDialog(false);
      return;
    },
    [t, queryParams, selectedRecord],
  );

  const {
    data: issueData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: issueKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<IssueSchema>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<IssueSchema>) => {
        unstable_batchedUpdates(() => {
          setSelectedRecord(row.original);
          setIsShowUpdateStatusDialog(true);
        });
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<IssueSchema>) => onDestroy(row.original.id),
    },
  ];

  const handleIconClick = (files: string) => {
    const parsedFiles = JSON.parse(files);
    unstable_batchedUpdates(() => {
      setSelectedFiles(parsedFiles);
      setIsOpen(true);
    });
  };

  const columns: ColumnDef<IssueSchema>[] = [
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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('issue_title')} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('issue_created_at')} />
      ),
      cell: ({ row }) => {
        return dayjs(row.original.createdAt ?? new Date()).format(
          'DD/MM/YYYY HH:mm',
        );
      },
    },
    {
      accessorKey: 'files',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Nội dung'} />
      ),
      cell: ({ row }) => {
        const files: any = row.original.files;
        return (
          <Space direction="horizontal">
            <Tooltip title="Xem file đính kèm">
              <ImageIcon
                onClick={() => {
                  setSelectedRecord(row.original);
                  handleIconClick(files);
                }}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </Space>
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
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('issue_status')} />
      ),
      cell: ({ row }) => {
        const status =
          (row.original.status?.toLowerCase() as
            | 'open'
            | 'in_progress'
            | 'done'
            | 'closed') ?? 'open';
        return (
          <Badge
            variant={
              status === 'open'
                ? 'default'
                : status === 'in_progress'
                  ? 'outline'
                  : status === 'done'
                    ? 'success'
                    : 'destructive'
            }
          >
            {t(`issue_s_${status}`)}
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

  const filterFields: DataTableFilterField<IssueSchema>[] = [
    {
      label: t('issue_title'),
      value: 'title',
      placeholder: t('common_ph_input', {
        field: t('issue_title').toLowerCase(),
      }),
    },
    {
      label: t('issue_status'),
      value: 'status',
      placeholder: t('common_ph_select', {
        field: t('issue_status').toLowerCase(),
      }),
      options: ISSUE_STATUS_OPTIONS,
    },
  ];

  const { table } = useDataTable({
    data: issueData?.results || [],
    columns,
    pageCount: issueData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'title'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  const renderDialog = () => {
    const content = selectedRecord?.content;
    const title = selectedRecord?.title;
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết phản ánh</DialogTitle>
          </DialogHeader>
          {title && (
            <h2 className="mb-2 font-semibold text-xl">Tiêu đề: {title}</h2>
          )}
          {content && (
            <p className="mb-4 text-base text-gray-700">
              <b>Nội dung:</b> {content}
            </p>
          )}
          <hr />
          <b>Tệp đính kèm:</b>
          {selectedFiles && <ImageVideoCarousel files={selectedFiles} />}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <ContentLayout title={t('issue_index_title')} pathname={pathname}>
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
            }}
            table={table}
            columns={columns}
            filterOptions={filterFields}
            loading={isFetching}
            moduleName="issue"
          />
          {renderDialog()}
        </>
      )}
      <UpdateIssueStatusDialog
        isOpen={isShowUpdateStatusDialog}
        onClose={() => setIsShowUpdateStatusDialog(false)}
        onSubmit={updateIssueStatus}
        isSubmitting={isSubmitting}
        initialData={selectedRecord}
      />
    </ContentLayout>
  );
}
