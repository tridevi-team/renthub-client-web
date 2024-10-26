import type { z } from '@app/lib/vi-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HouseEditForm from '@modules/houses/components/house-edit-form';
import { useHouseDetail } from '@modules/houses/hooks/use-house-detail.hook';
import { useHouseUpdate } from '@modules/houses/hooks/use-house-update.hook';
import { housePath } from '@modules/houses/routes';
import {
  houseUpdateRequestSchema,
  type HouseUpdateRequestSchema,
} from '@modules/houses/schema/house.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
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
  const mutation = useHouseUpdate();

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
    try {
      const result = await mutation.mutateAsync(values);
      form.reset();
      navigate(`${housePath.root}`);
      return result;
    } catch (error) {
      setLoading(false);
      return Promise.reject(error);
    }
  };

  return (
    <ContentLayout title={t('house_edit_title')} pathname={pathname}>
      <HouseEditForm form={form} onSubmit={onSubmit} loading={loading} />
    </ContentLayout>
  );
}
