import { authPath } from '@auth/routes';
import { dashboardRoute } from '@modules/dashboard/routes';
import ContentArea from '@shared/components/admin-panel/content-area';
import { ContentLayout } from '@shared/components/admin-panel/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@shared/components/ui/breadcrumbs';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '@shared/utils/checker.util';
import { Link } from 'react-aria-components';
import { redirect, type LoaderFunction } from 'react-router-dom';

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

  return (
    <ContentLayout title="Users">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={dashboardRoute.path}>{t('dashboard_title')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ContentArea>Nội dung trang web</ContentArea>
    </ContentLayout>
  );
}
