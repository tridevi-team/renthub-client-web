import { queryClient } from '@app/providers/query/client';
import { useHouseStore } from '@app/stores';
import type { DataTableFilterField, Option } from '@app/types';
import { authPath } from '@auth/routes';
import { floorRepositories } from '@modules/floors/apis/floor.api';
import { roomRepositories } from '@modules/rooms/apis/room.api';
import { roomPath } from '@modules/rooms/routes';
import { roomKeys } from '@modules/rooms/schema/room.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableColumnHeader } from '@shared/components/data-table/data-table-column-header';
import {
  DataTableRowActions,
  type Action,
} from '@shared/components/data-table/data-table-row-actions';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Badge, type BadgeVariant } from '@shared/components/ui/badge';
import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { DEFAULT_RETURN_TABLE_DATA } from '@shared/constants/general.constant';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useUpdateEffect } from '@shared/hooks/use-update-effect.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import {
  compareFloorNames,
  processSearchParams,
} from '@shared/utils/helper.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, Row } from '@tanstack/react-table';
import to from 'await-to-js';
import { ChevronDown, ChevronUp, Edit, FileEdit, Trash } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
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
    module: 'room',
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

const SHOW_MORE_BUTTON_WIDTH = 100;

export function Element() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { data: houseSelected } = useHouseStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const [searchParams] = useSearchParams();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [floors, setFloors] = useState<Option[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showMore, setShowMore] = useState(false);
  const [editingTab, setEditingTab] = useState<Option | null>(null);
  const [visibleTabs, setVisibleTabs] = useState(5);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showServiceDialog, setShowServiceDialog] = useState(false);

  const updateVisibleTabs = useCallback(() => {
    if (!containerRef.current || !tabRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const tabElement = tabRef.current;
    const tabStyles = window.getComputedStyle(tabElement);
    const tabFullWidth =
      tabElement.offsetWidth +
      Number.parseInt(tabStyles.marginLeft) +
      Number.parseInt(tabStyles.marginRight);

    const maxTabs = Math.floor(
      (containerWidth - SHOW_MORE_BUTTON_WIDTH) / tabFullWidth,
    );
    setVisibleTabs(Math.max(1, maxTabs));
  }, []);

  useEffect(() => {
    if (floors.length > 0) {
      updateVisibleTabs();
    }
  }, [floors, updateVisibleTabs]);

  const displayedTabs = useMemo(() => {
    const activeTabIndex = (floors || []).findIndex(
      (tab) => tab.value === activeTab,
    );
    if (activeTabIndex >= visibleTabs) {
      const newDisplayedTabs = [
        ...floors.slice(0, visibleTabs - 1),
        floors[activeTabIndex],
      ];
      return newDisplayedTabs;
    }
    return floors.slice(0, visibleTabs);
  }, [floors, activeTab, visibleTabs]);

  const hiddenTabs = floors.slice(visibleTabs);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setShowMore(false);
  };

  const handleEditTab = (tab: Option) => {
    setEditingTab(tab);
  };

  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const fetchFloorData = useCallback(async () => {
    const [err, resp] = await to(
      floorRepositories.index({
        searchParams: {
          pageSize: -1,
          page: -1,
        },
      }),
    );
    if (err) setFloors([]);
    const floors = resp?.data?.results?.map((floor) => ({
      label: floor.name,
      value: floor.id,
    }));
    (floors || []).sort((a, b) => compareFloorNames(a.label, b.label));
    if (floors) {
      setFloors(floors);
      if (floors.length > 0 && !activeTab) {
        setActiveTab(floors[0].value.toString());
      }
    }
  }, [activeTab]);

  const fetchData = useCallback(
    async (params: URLSearchParams) => {
      if (!activeTab) return DEFAULT_RETURN_TABLE_DATA;
      const searchParams = processSearchParams(params, 'rooms', {
        field: 'name',
        direction: 'asc',
      });
      const [err, result] = await to(
        roomRepositories.index({
          floorId: activeTab,
          searchParams,
        }),
      );
      if (err) {
        return DEFAULT_RETURN_TABLE_DATA;
      }
      return result?.data;
    },
    [activeTab],
  );

  const onDelete = useCallback(
    async (selectedItems: any[]) => {
      const [err, _]: AwaitToResult<any> = await to(
        roomRepositories.deleteMany({
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
        queryKey: roomKeys.list(queryParams),
      });
      toast.success(t('ms_delete_room_success'));
    },
    [t, queryParams],
  );

  const onCreate = useCallback(() => {
    navigate(`${roomPath.root}/${roomPath.create}`);
  }, [navigate]);

  const {
    data: roomData,
    isLoading,
    isFetching,
  } = useQuery<any>({
    queryKey: roomKeys.list(queryParams),
    queryFn: async () => fetchData(searchParams),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isLoading]);

  const actionColumn: Action<any>[] = [
    {
      label: t('bt_edit'),
      icon: <FileEdit className="mr-2 h-4 w-4" />,
      onClick: async (row: Row<any>) => {
        navigate(
          `${roomPath.root}/${roomPath.edit.replace(':id', row.original.id)}`,
          {
            state: {
              status: row.original.status,
              floor: floors.find((floor) => floor.value === activeTab),
            },
          },
        );
      },
    },
    {
      label: t('bt_delete'),
      icon: <Trash className="mr-2 h-4 w-4" />,
      isDanger: true,
      onClick: (row: Row<any>) => onDelete([row.original]),
    },
  ];

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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('room_name')} />
      ),
    },
    {
      accessorKey: 'maxRenters',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('room_max_renter')} />
      ),
      cell: ({ row }) => {
        const maxRenters = row.original.maxRenters || 1;
        return maxRenters < 0 ? `${-maxRenters} người` : `${maxRenters} người`;
      },
    },
    {
      accessorKey: 'roomArea',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('room_area')} />
      ),
      cell: ({ row }) => {
        return row.original.roomArea ? `${row.original.roomArea}m²` : '';
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('room_price')} />
      ),
      cell: ({ row }) => {
        return row.original.price
          ? `${row.original.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`
          : '';
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('room_status')} />
      ),
      cell: ({ row }) => {
        // success, warning, info, danger
        const statusToVariant: Record<string, BadgeVariant> = {
          available: 'default',
          rented: 'outline',
          pending: 'success',
          maintenance: 'destructive',
          expired: 'warning',
        };
        return (
          <Badge
            variant={statusToVariant[row.original.status?.toLowerCase()]}
            className=" justify-center"
          >
            {t(
              `room_s_${(row.original.status?.toLowerCase() as 'available' | 'rented' | 'pending' | 'maintenance' | 'expired') ?? 'available'}`,
            )}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('room_description')} />
      ),
      cell: ({ row }) => {
        return <span className="line-clamp-1">{row.original.description}</span>;
      },
    },
    {
      id: 'services',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('room_services')} />
      ),
      cell: ({ row }) => {
        return (
          <Button
            className="m-0 p-0"
            variant="link"
            onClick={() => {
              unstable_batchedUpdates(() => {
                setSelectedRecord(row.original);
                setShowServiceDialog(true);
              });
            }}
          >
            Xem chi tiết
          </Button>
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

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: t('room_name'),
      value: 'name',
      placeholder: t('common_ph_input', {
        field: t('room_name').toLowerCase(),
      }),
    },
  ];

  const { table } = useDataTable({
    data: roomData?.results || [],
    columns,
    pageCount: roomData?.pageCount || 0,
    filterFields,
    initialState: {
      columnPinning: { right: ['actions'], left: ['select', 'name'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  const renderServiceDialog = () => {
    return (
      <Dialog
        open={showServiceDialog}
        onOpenChange={() => {
          unstable_batchedUpdates(() => {
            setSelectedRecord(null);
            setShowServiceDialog(false);
          });
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết dịch vụ phòng</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="flex justify-between border-b pb-2">
              <div className="font-semibold">Dịch vụ</div>
              <div className="font-semibold">Chỉ số ban đầu</div>
              <div className="font-semibold">Đơn giá</div>
            </div>
            <div className="mt-2">
              {selectedRecord?.services?.map(
                (service: {
                  id: string;
                  name: string;
                  startIndex: number | null;
                  quantity: number;
                  unitPrice: number;
                }) => (
                  <div
                    key={service.id}
                    className="flex justify-between border-b py-2"
                  >
                    <div>{service.name}</div>
                    <div>{service.startIndex ?? '-'}</div>
                    <div>{service.unitPrice.toLocaleString()}đ</div>
                  </div>
                ),
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: roomKeys.list(queryParams),
    });
  }, [activeTab]);

  useEffect(() => {
    fetchFloorData();
  }, []);

  useUpdateEffect(() => {
    fetchFloorData();
  }, [houseSelected?.id]);

  return (
    <ContentLayout title={t('room_index_title')} pathname={pathname}>
      <div className="relative mb-4" ref={containerRef}>
        <Tabs value={activeTab} onValueChange={handleTabClick}>
          <TabsList className="w-full flex-nowrap justify-start">
            {displayedTabs.map((tab, index) => (
              <TabsTrigger
                key={tab.value?.toString()}
                value={tab.value?.toString()}
                className="m-1 flex items-center px-4 py-1"
                ref={index === 0 ? tabRef : undefined}
              >
                {tab.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTab(tab);
                  }}
                >
                  <Edit className="h-3 w-3" />
                  <span className="sr-only">
                    {t('bt_edit')} {tab.label}
                  </span>
                </Button>
              </TabsTrigger>
            ))}
            {(hiddenTabs || []).length > 0 && (
              <Button
                size="xs"
                variant="link"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? (
                  <>
                    <ChevronUp className="mt-0.5 mr-1 h-4 w-4" />
                    {t('common_show_less')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="mt-0.5 mr-1 h-4 w-4" />
                    {t('common_show_all')}
                  </>
                )}
              </Button>
            )}
          </TabsList>
        </Tabs>
        {showMore && (
          <div className="mt-2 rounded-md border shadow-sm">
            <ScrollArea className="max-h-48">
              <div className="grid grid-cols-6 gap-2 p-2">
                {hiddenTabs.map((tab) => (
                  <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start"
                    onClick={() => handleTabClick(tab?.value?.toString())}
                  >
                    {tab.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTab(tab);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                      <span className="sr-only">
                        {t('bt_edit')} {tab.label}
                      </span>
                    </Button>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
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
          columnWidths={['2rem', '9rem', '9rem', '9rem', '9rem', '9rem']}
          moduleName="room"
        />
      )}
      {renderServiceDialog()}
    </ContentLayout>
  );
}
