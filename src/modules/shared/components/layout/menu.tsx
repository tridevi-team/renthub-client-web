import { getMenuList } from '@app/config/sidebar.config';
import { cn } from '@app/lib/utils';
import { CollapseMenuButton } from '@shared/components/layout/collapse-menu-button';
import { Button } from '@shared/components/ui/button';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { Ellipsis } from 'lucide-react';
import { Link } from 'react-aria-components';
import { useLocation } from 'react-router-dom';

interface MenuProps {
  isOpen: boolean | undefined;
}

const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <ScrollArea className="[&>div>div[style]]:!block overflow-auto">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px-70px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li
              className={cn('w-full', groupLabel ? 'pt-5' : '')}
              key={`${groupLabel}-${+index}`}
            >
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2">{null}</p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={`${href}-${+index}`}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? 'secondary' : 'ghost'}
                              className={cn(
                                'w-full justify-start h-10 mb-1',
                                active
                                  ? 'bg-primary text-white hover:bg-primary hover:text-white'
                                  : '',
                              )}
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? '' : 'mr-4')}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    'max-w-[200px] truncate',
                                    isOpen === false
                                      ? '-translate-x-96 opacity-0'
                                      : 'translate-x-0 opacity-100',
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={`${href}-${+index}`}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={false}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
