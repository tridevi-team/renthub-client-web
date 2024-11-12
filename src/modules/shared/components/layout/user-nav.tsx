import { Lock, LogOut, User } from 'lucide-react';
import { Link } from 'react-aria-components';

import { useHouseStore } from '@app/stores';
import { authRepositories } from '@modules/auth/apis/auth.api';
import { AccountInfoDialog } from '@modules/auth/components/account-info-dialog';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { authPath } from '@modules/auth/routes';
import type {
  UpdateUserInfoRequestSchema,
  UpdateUserInfoResponseSchema,
  UserInfoResponseSchema,
} from '@modules/auth/schemas/auth.schema';
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
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { useQueryClient } from '@tanstack/react-query';
import to from 'await-to-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function UserNav() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const { clearUser, user } = useAuthUserStore();
  const queryClient = useQueryClient();
  const { setData: setSelectedHouse } = useHouseStore();
  const [isAccountDialogOpen, setAccountDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInformation, setUserInformation] =
    useState<UserInfoResponseSchema | null>(null);
  const genAvatarFallback = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names?.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
      }
      return names[0][0].toUpperCase();
    }
    return 'JD';
  };

  const getUserInfo = async () => {
    setLoading(true);
    const [err, user]: [
      ErrorResponseSchema | null,
      UserInfoResponseSchema | undefined,
    ] = await to(authRepositories.getInfo());
    setLoading(false);
    console.log('err:', err);
    if (err) {
      toast.error(t(err.code));
      return;
    }
    return user || null;
  };

  const onUpdateUserInfo = async (data: UpdateUserInfoRequestSchema) => {
    setLoading(true);
    const [err, _]: [
      ErrorResponseSchema | null,
      UpdateUserInfoResponseSchema | undefined,
    ] = await to(authRepositories.updateInfo({ json: data }));
    setLoading(false);
    if (err) {
      toast.error(t(err.code));
    }
    toast.success(t('ms_update_account_success'));
    setAccountDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
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
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={async () => {
                const user = await getUserInfo();
                if (user) {
                  setUserInformation(user);
                  setAccountDialogOpen(true);
                }
              }}
            >
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              {t('menu_account')}
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
              clearUser();
              setSelectedHouse(null);
              queryClient.clear();
              navigate(authPath.login);
            }}
          >
            <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
            {t('menu_signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AccountInfoDialog
        isOpen={isAccountDialogOpen}
        onClose={() => setAccountDialogOpen(false)}
        isLoading={loading}
        onSubmit={onUpdateUserInfo}
        userResponse={userInformation}
      />
    </>
  );
}
