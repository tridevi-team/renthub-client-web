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
      <Navbar />
      <div className="h-[20vh] bg-gradient-to-r from-[#2A519D] via-teal-600/50 to-emerald-200/25">
        <div className="overflow-hidden px-4 py-4 sm:px-8 2xl:px-10">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white text-xl">
              {title?.toUpperCase()}
            </p>
            <Breadcrumbs pathname={pathname} />
          </div>
          <ContentArea>{children}</ContentArea>
        </div>
      </div>
    </div>
  );
}
