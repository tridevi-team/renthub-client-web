import { Lock, LogOut, User } from 'lucide-react';

import { useHouseStore } from '@app/stores';
import { authRepositories } from '@modules/auth/apis/auth.api';
import { AccountInfoDialog } from '@modules/auth/components/account-info-dialog';
import { ChangePasswordDialog } from '@modules/auth/components/change-password-dialog';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { authPath } from '@modules/auth/routes';
import type {
  ChangePasswordRequestSchema,
  ChangePasswordResponseSchema,
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
import { useQueryClient } from '@tanstack/react-query';
import to from 'await-to-js';

import type { AwaitToResult } from '@shared/types/date.type';
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
  const [isChangePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    const [err, user]: AwaitToResult<UserInfoResponseSchema> = await to(
      authRepositories.getInfo(),
    );
    setLoading(false);
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return;
    }
    return user || null;
  };

  const onUpdateUserInfo = async (data: UpdateUserInfoRequestSchema) => {
    setSubmitting(true);
    const [err, _]: AwaitToResult<UpdateUserInfoResponseSchema> = await to(
      authRepositories.updateInfo({ json: data }),
    );
    setSubmitting(false);
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
    }
    toast.success(t('ms_update_account_success'));
    setAccountDialogOpen(false);
  };

  const onChangePassword = async (data: ChangePasswordRequestSchema) => {
    setSubmitting(true);
    const [err, _]: AwaitToResult<ChangePasswordResponseSchema> = await to(
      authRepositories.changePassword({ json: data }),
    );
    setSubmitting(false);
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return;
    }
    toast.success(t('ms_change_password_success'));
    clearUser();
    setSelectedHouse(null);
    queryClient.clear();
    navigate(authPath.login);
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
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => setChangePasswordDialogOpen(true)}
            >
              <Lock className="mr-3 h-4 w-4 text-muted-foreground" />
              {t('menu_changePassword')}
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
        isLoadingData={loading}
        isSubmitting={submitting}
        onSubmit={onUpdateUserInfo}
        userResponse={userInformation}
      />
      <ChangePasswordDialog
        isOpen={isChangePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        isSubmitting={submitting}
        onSubmit={onChangePassword}
      />
    </>
  );
}
