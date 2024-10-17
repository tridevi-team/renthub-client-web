import { cn } from '@app/lib/utils';
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
import { House, LogOut, MenuIcon } from 'lucide-react';
import { Link } from 'react-aria-components';

export function SheetMenu() {
  const isOpen = true;
  const [t] = useI18n();

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link
              href={dashboardPath.index}
              className="flex items-center gap-2"
            >
              <House className="w-6 h-6 mr-1" />
              <h1 className="font-bold text-lg">{BRAND_NAME}</h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {}}
                variant="outline"
                className="w-full justify-center h-10 mt-5"
              >
                <span className={cn(!isOpen ? '' : 'mr-4')}>
                  <LogOut size={18} />
                </span>
                <p
                  className={cn(
                    'whitespace-nowrap',
                    !isOpen ? 'opacity-0 hidden' : 'opacity-100',
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
