import { HouseSelect } from '@shared/components/layout/house-select';
import { NotificationPopover } from '@shared/components/layout/notification-popover';
import { SheetMenu } from '@shared/components/layout/sheet-menu';
import { UserNav } from '@shared/components/layout/user-nav';

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/100 shadow backdrop-blur supports-[backdrop-filter]:bg-background/100 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <HouseSelect />
          <NotificationPopover />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
