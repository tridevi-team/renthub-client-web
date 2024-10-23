import type { z } from '@app/lib/vi-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import HouseForm from '@modules/houses/components/house-form';
import {
  houseCreateRequestSchema,
  type HouseCreateRequestSchema,
} from '@modules/houses/schema/house.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { useForm } from 'react-hook-form';
import { type LoaderFunction, redirect, useLocation } from 'react-router-dom';
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
  const form = useForm<HouseCreateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(houseCreateRequestSchema),
  });

  const onSubmit = (values: z.infer<typeof houseCreateRequestSchema>) => {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  };

  return (
    <ContentLayout title={t('house_create_title')} pathname={pathname}>
      <HouseForm form={form} onSubmit={onSubmit} />
    </ContentLayout>
  );
}
