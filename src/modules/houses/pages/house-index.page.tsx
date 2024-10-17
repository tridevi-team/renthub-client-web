import { authPath } from '@auth/routes';
import { houseRepositories } from '@modules/houses/apis/house.api';
import type { HouseSchema } from '@modules/houses/schema/house.schema';
import { DataTable } from '@shared/components/data-table/data-table';
import { DataTableSkeleton } from '@shared/components/data-table/data-table-skeleton';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Checkbox } from '@shared/components/ui/checkbox';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
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
  const pathname = useLocation().pathname;
  const [searchParams, _] = useSearchParams();

  const queryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    });
    return params;
  }, [searchParams]);

  const { data: houseData, isLoading } = useQuery<HouseSchema[]>({
    queryKey: ['houses-index', queryParams],
    queryFn: async () => {
      const response = await houseRepositories.index({
        searchParams: {
          filters: [
            {
              field: 'houses.name',
              operator: 'cont',
              value: 'vis',
            },
          ],
          page: 1,
          pageSize: 10,
        },
      });
      return response.data?.results || [];
    },
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
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        return row.original.status === 0 ? 'active' : 'inactive';
      },
    },
  ];

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
          columns={columns}
          data={houseData || []}
          filterColumn="address"
          filterOptions={[
            {
              column: 'status',
              title: 'Status',
              options: [
                { label: 'For Sale', value: 'for_sale' },
                { label: 'Sold', value: 'sold' },
              ],
            },
          ]}
        />
      )}
    </ContentLayout>
  );
}
