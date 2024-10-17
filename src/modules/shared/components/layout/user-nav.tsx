import { Lock, LogOut, User } from 'lucide-react';
import { Link } from 'react-aria-components';

import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { authPath } from '@modules/auth/routes';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@shared/components/ui/avatar';
import { Button } from '@shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useNavigate } from 'react-router-dom';

export function UserNav() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const { clearUser, user } = useAuthUserStore();

  const genAvatarFallback = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
      }
      return names[0][0];
    }
    return 'JD';
  };

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {genAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t('menu_profile')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">
              {user?.fullName || ''}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email || ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              {t('menu_account')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link className="flex items-center" onPress={() => {}}>
              <Lock className="mr-3 h-4 w-4 text-muted-foreground" />
              {t('menu_changePassword')}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => {
            clearUser(); // reset `user` store
            navigate(authPath.login); // back to login
          }}
        >
          <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
          {t('menu_signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
