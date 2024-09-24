import { dashboardPath } from '@modules/dashboard/routes';
import { Menu } from '@shared/components/layout/menu';
import { Button } from '@shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@shared/components/ui/sheet';
import { BRAND_NAME } from '@shared/constants/general.constant';
import { House, MenuIcon } from 'lucide-react';
import { Link } from 'react-aria-components';

export function SheetMenu() {
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
      </SheetContent>
    </Sheet>
  );
}
