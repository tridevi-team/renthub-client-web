import type { DataTableFilterField } from '@app/types';
import { authPath } from '@auth/routes';
import { houseRepositories } from '@modules/houses/apis/house.api';
import type {
  HouseDataSchema,
  HouseSchema,
} from '@modules/houses/schema/house.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Checkbox } from '@shared/components/ui/checkbox';
import { useDataTable } from '@shared/hooks/use-data-table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import {
  redirect,
  useLocation,
  useSearchParams,
  type LoaderFunction,
} from 'react-router-dom';
import { toast } from 'sonner';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();

  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams, _] = useSearchParams();

  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const fetchData = useCallback(async (params: URLSearchParams) => {
    const filters = params.getAll('filter').map((filter) => {
      const [field, operator, value] = filter.split(':');
      return { field, operator, value };
    });
    const sort = params.get('sort')?.split(':') || [];
    const page = Number.parseInt(params.get('page') || '1', 10);
    const pageSize = Number.parseInt(params.get('pageSize') || '10', 10);

    const response = await houseRepositories.index({
      searchParams: {
        filters,
        sorting: sort[0]
          ? [{ field: sort[0], direction: sort[1] }]
          : [{ field: 'id', direction: 'desc' }],
        page,
        pageSize,
      },
    });
    return response.data || null;
  }, []);

  const { data: houseData, isLoading } = useQuery<HouseDataSchema>({
    queryKey: ['houses-index', queryParams],
    queryFn: async () => fetchData(searchParams),
  });

  const columns: ColumnDef<HouseSchema>[] = [
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
      header: 'Tên nhà trọ',
    },
    {
      accessorKey: 'address',
      header: 'Địa chỉ',
      cell: ({ row }) => {
        const { city, ward, street, district } = row.original.address;
        return `${street}, ${ward}, ${district}, ${city}`;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        return row.original.status === 0 ? 'active' : 'inactive';
      },
      enableSorting: true,
    },
  ];

  const filterFields: DataTableFilterField<HouseSchema>[] = [
    {
      label: 'Tên nhà trọ',
      value: 'name',
      placeholder: 'Nhập tên nhà trọ',
    },
    {
      label: 'Trạng thái',
      value: 'status',
      placeholder: 'Chọn trạng thái',
      options: [
        { label: 'active', value: '0' },
        { label: 'inactive', value: '1' },
      ],
    },
  ];

  const { table } = useDataTable({
    data: houseData?.results || [],
    columns,
    pageCount: houseData?.pageCount || 0,
    filterFields,
    initialState: {
      sorting: [{ id: 'id', desc: true }],
      // columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  return (
    <ContentLayout title={t('house_index_title')} pathname={pathname}>
      {isLoading ? (
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
          shrinkZero
        />
      ) : (
        <DataTable
          table={table}
          columns={columns}
          filterOptions={filterFields}
        />
      )}
    </ContentLayout>
  );
}
