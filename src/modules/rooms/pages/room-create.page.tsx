import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { roomRepositories } from '@modules/rooms/apis/room.api';
import { RoomForm } from '@modules/rooms/components/room-form';
import { roomPath } from '@modules/rooms/routes';
import {
  type RoomCreateResponseSchema,
  type RoomFormRequestSchema,
  roomFormRequestSchema,
} from '@modules/rooms/schemas/room.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { ROOM_STATUS } from '@shared/constants/general.constant';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import to from 'await-to-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type LoaderFunction,
  redirect,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'sonner';
export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const hasPermission = checkPermissionPage({
    module: 'room',
    action: 'create',
  });
  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }
  if (!hasPermission) {
    return redirect(authPath.notPermission);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [loading, setLoading] = useState(false);

  const form = useForm<RoomFormRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(roomFormRequestSchema),
    defaultValues: {
      status: ROOM_STATUS.AVAILABLE,
    },
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    const [err, _]: AwaitToResult<RoomCreateResponseSchema> = await to(
      roomRepositories.create({
        data: values,
      }),
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
    toast.success(t('ms_create_room_success'));
    navigate(`${roomPath.root}`);
    return _;
  };

  return (
    <ContentLayout title={t('room_create_title')} pathname={pathname}>
      <RoomForm form={form} onSubmit={onSubmit} loading={loading} />
    </ContentLayout>
  );
}
