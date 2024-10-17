import { authPath } from '@auth/routes';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { checkAuthUser } from '@shared/utils/checker.util';
import { redirect, useLocation, type LoaderFunction } from 'react-router-dom';
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
  const pathname = useLocation().pathname;

  return (
    <ContentLayout title="Dashboard" pathname={pathname}>
      Nội dung trang web
    </ContentLayout>
  );
}
