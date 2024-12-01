import { cn } from '@app/lib/utils';
import { Footer } from '@shared/components/layout/footer';
import { Sidebar } from '@shared/components/layout/sidebar';
import { useStore } from '@shared/hooks/use-sidebar-store';
import { useSidebarToggle } from '@shared/hooks/use-sidebar-toggle';
import { useNavigation } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    '0': '#3A72ED',
    '1.0': '#3A72ED',
  },
  barThickness: 1.5,
  shadowBlur: 2,
});

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const navigation = useNavigation();

  if (!sidebar) return null;

  return (
    <>
      {navigation.state === 'loading' ? <TopBarProgress /> : null}
      <Sidebar />
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] duration-300 ease-in-out',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
