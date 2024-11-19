import type { z } from '@app/lib/vi-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import HouseForm from '@modules/houses/components/house-create-form';
import { useHouseCreate } from '@modules/houses/hooks/use-house-create.hook';
import { housePath } from '@modules/houses/routes';
import {
  houseCreateRequestSchema,
  type HouseCreateRequestSchema,
} from '@modules/houses/schema/house.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type LoaderFunction,
  redirect,
  useLocation,
  useNavigate,
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const form = useForm<HouseCreateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(houseCreateRequestSchema),
  });
  const mutation = useHouseCreate();
  const onSubmit = async (values: z.infer<typeof houseCreateRequestSchema>) => {
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
    <ContentLayout title={t('house_create_title')} pathname={pathname}>
      <HouseForm form={form} onSubmit={onSubmit} loading={loading} />
    </ContentLayout>
  );
}
