import type { z } from '@app/lib/vi-zod';
import { queryClient } from '@app/providers/query/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { houseRepositories } from '@modules/houses/apis/house.api';
import HouseEditForm from '@modules/houses/components/house-edit-form';
import { useHouseDetail } from '@modules/houses/hooks/use-house-detail.hook';
import { housePath } from '@modules/houses/routes';
import {
  houseKeys,
  houseUpdateRequestSchema,
  type HouseUpdateRequestSchema,
  type HouseUpdateResponseSchema,
} from '@modules/houses/schema/house.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { checkAuthUser } from '@shared/utils/checker.util';
import to from 'await-to-js';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type LoaderFunction,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'sonner';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();

  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { id } = useParams();

  const { data: houseDetail } = useHouseDetail(id);

  const form = useForm<HouseUpdateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(houseUpdateRequestSchema),
  });

  useEffect(() => {
    if (houseDetail?.data) {
      form.reset({
        ...houseDetail.data,
        city: houseDetail.data.address.city,
        ward: houseDetail.data.address.ward,
        street: houseDetail.data.address.street,
        district: houseDetail.data.address.district,
        description: houseDetail.data.description ?? undefined,
        contractDefault: houseDetail.data.contractDefault as string | undefined,
        status: houseDetail.data.status as number,
      });
    }
  }, [houseDetail, form]);

  const onSubmit = async (values: z.infer<typeof houseUpdateRequestSchema>) => {
    setLoading(true);
    const [err, _]: [
      ErrorResponseSchema | null,
      HouseUpdateResponseSchema | undefined,
    ] = await to(houseRepositories.update(values));
    setLoading(false);
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return;
    }
    await queryClient.invalidateQueries({
      queryKey: houseKeys.list({}),
    });
    toast.success(t('ms_update_house_success'));
    navigate(`${housePath.root}`);
  };

  return (
    <ContentLayout title={t('house_edit_title')} pathname={pathname}>
      <HouseEditForm form={form} onSubmit={onSubmit} loading={loading} />
    </ContentLayout>
  );
}
