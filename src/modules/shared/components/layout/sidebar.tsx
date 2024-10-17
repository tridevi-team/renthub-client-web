import { House, LogOut } from 'lucide-react';
import { Link } from 'react-aria-components';

import { cn } from '@app/lib/utils';
import { dashboardPath } from '@modules/dashboard/routes';
import { Menu } from '@shared/components/layout/menu';
import { SidebarToggle } from '@shared/components/layout/sidebar-toggle';
import { Button } from '@shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { BRAND_NAME } from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useStore } from '@shared/hooks/use-sidebar-store';
import { useSidebarToggle } from '@shared/hooks/use-sidebar-toggle';

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const [t] = useI18n();
  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72',
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0',
          )}
          variant="link"
          asChild
        >
          <Link href={dashboardPath.index} className="flex items-center gap-2">
            <House className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                sidebar?.isOpen === false
                  ? '-translate-x-96 opacity-0 hidden'
                  : 'translate-x-0 opacity-100',
              )}
            >
              {BRAND_NAME}
            </h1>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {}}
                variant="outline"
                className="w-full justify-center h-10 mt-5"
              >
                <span className={cn(sidebar?.isOpen === false ? '' : 'mr-4')}>
                  <LogOut size={18} />
                </span>
                <p
                  className={cn(
                    'whitespace-nowrap',
                    sidebar?.isOpen === false
                      ? 'opacity-0 hidden'
                      : 'opacity-100',
                  )}
                >
                  {t('menu_signOut')}
                </p>
              </Button>
            </TooltipTrigger>
            {sidebar?.isOpen === false && (
              <TooltipContent side="right">{t('menu_signOut')}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
