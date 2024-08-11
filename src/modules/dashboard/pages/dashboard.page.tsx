import { authPath } from '@auth/routes';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { redirect, useLocation, type LoaderFunction } from 'react-router-dom';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();

  // redirect NOT authed user to login
  if (!authed) {
    // save message to show in login page (because cannot use hook i18n in loader)
    sessionStorage.setItem('toastMessage', 'er_401');
    return redirect(authPath.login);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const pathname = useLocation().pathname;
  console.log('pathname:', pathname);

  return (
    <ContentLayout title="Dashboard" pathname={pathname}>
      Nội dung trang web
    </ContentLayout>
  );
}
