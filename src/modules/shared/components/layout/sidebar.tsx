import { cn } from '@app/lib/utils';
import { useHouseStore } from '@app/stores';
import logo from '@assets/logo/logo.png';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { authPath } from '@modules/auth/routes';
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
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Link } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const [t] = useI18n();
  const queryClient = useQueryClient();
  const { clearUser } = useAuthUserStore();
  const navigate = useNavigate();
  const { setData: setSelectedHouse } = useHouseStore();
  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        '-translate-x-full fixed top-0 left-0 z-20 h-screen transition-[width] duration-300 ease-in-out lg:translate-x-0',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72',
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            'mb-1 transition-transform duration-300 ease-in-out',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0',
          )}
          variant="link"
          asChild
        >
          <Link
            className="flex items-center gap-2"
            onPress={() => {
              navigate('/');
            }}
          >
            <img
              src={logo}
              alt={BRAND_NAME}
              className={cn(
                'mt-2 mr-2 transition-[transform,opacity,display] duration-300 ease-in-out',
                sidebar?.isOpen === true ? 'w-8' : 'w-5',
              )}
              loading="lazy"
              aria-label={BRAND_NAME}
            />
            <h1
              className={cn(
                'mt-2 whitespace-nowrap font-bold text-lg transition-[transform,opacity,display] duration-300 ease-in-out',
                sidebar?.isOpen === false
                  ? '-translate-x-96 hidden opacity-0'
                  : 'translate-x-0 opacity-100',
              )}
              aria-label={BRAND_NAME}
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
                onClick={() => {
                  clearUser();
                  setSelectedHouse(null);
                  queryClient.clear();
                  navigate(authPath.login);
                }}
                variant="outline"
                className="mt-5 h-10 w-full justify-center"
              >
                <span className={cn(sidebar?.isOpen === false ? '' : 'mr-4')}>
                  <LogOut size={18} />
                </span>
                <p
                  className={cn(
                    'whitespace-nowrap',
                    sidebar?.isOpen === false
                      ? 'hidden opacity-0'
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
