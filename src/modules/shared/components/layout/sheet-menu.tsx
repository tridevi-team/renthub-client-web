import { cn } from '@app/lib/utils';
import { useHouseStore } from '@app/stores';
import logo from '@assets/logo/logo.png';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { authPath } from '@modules/auth/routes';
import { dashboardPath } from '@modules/dashboard/routes';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Menu } from '@shared/components/layout/menu';
import { Button } from '@shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@shared/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { BRAND_NAME } from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, MenuIcon } from 'lucide-react';
import { Link } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
export function SheetMenu() {
  const isOpen = true;
  const [t] = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearUser } = useAuthUserStore();
  const { setData: setSelectedHouse } = useHouseStore();

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button
            className="flex items-center justify-center pt-1 pb-2"
            variant="link"
            asChild
          >
            <Link
              href={dashboardPath.index}
              className="flex items-center gap-2"
            >
              <img
                src={logo}
                alt={BRAND_NAME}
                className={cn(
                  'mr-2 w-5 transition-[transform,opacity,display] duration-300 ease-in-out',
                )}
                loading="lazy"
                aria-label={BRAND_NAME}
              />
              <h1 className="font-bold text-lg">{BRAND_NAME}</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
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
                <span className={cn(!isOpen ? '' : 'mr-4')}>
                  <LogOut size={18} />
                </span>
                <p
                  className={cn(
                    'whitespace-nowrap',
                    !isOpen ? 'hidden opacity-0' : 'opacity-100',
                  )}
                >
                  {t('menu_signOut')}
                </p>
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">{t('menu_signOut')}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
