import Breadcrumbs from '@shared/components/layout/breadcrumb';
import ContentArea from '@shared/components/layout/content-area';
import { Navbar } from '@shared/components/layout/navbar';

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  pathname: string;
}

export function ContentLayout({
  title,
  children,
  pathname,
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="px-4 py-4 sm:px-8 2xl:px-10">
        <div className="flex justify-end">
          <Breadcrumbs pathname={pathname} />
        </div>
        <ContentArea>{children}</ContentArea>
      </div>
    </div>
  );
}
