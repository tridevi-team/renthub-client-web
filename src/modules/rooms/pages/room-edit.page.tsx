import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { roomRepositories } from '@modules/rooms/apis/room.api';
import { RoomForm } from '@modules/rooms/components/room-form';
import { roomPath } from '@modules/rooms/routes';
import type {
  RoomFormRequestSchema,
  RoomUpdateResponseSchema,
} from '@modules/rooms/schema/room.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import to from 'await-to-js';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type LoaderFunction,
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const hasPermission = checkPermissionPage({
    module: 'room',
    action: 'update',
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
  const { id } = useParams<{ id: string }>();
  const { status, floor } = location.state || { status: 'AVAILABLE' };
  console.log('floor:', floor);

  const form = useForm<RoomFormRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(z.any()),
  });

  const fetchDetail = async () => {
    if (!id) return;
    const [err, resp]: AwaitToResult<any> = await to(
      roomRepositories.detail({ id }),
    );
    if (err) {
      toast.error(t('UNKNOWN_ERROR'));
      return;
    }
    const service = resp?.data?.services?.map((service: any) => {
      return service.id;
    });
    form.reset({
      ...resp?.data,
      serviceIds: service,
      status: status,
      floor: floor.value,
    });
  };

  const onSubmit = async (values: any) => {
    if (!id) return navigate(`${roomPath.root}`);
    setLoading(true);
    const [err, _]: AwaitToResult<RoomUpdateResponseSchema> = await to(
      roomRepositories.update({
        id: id,
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
    toast.success(t('ms_update_room_success'));
    navigate(`${roomPath.root}`);
    return _;
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <ContentLayout title={t('room_edit_title')} pathname={pathname}>
      <RoomForm
        form={form}
        onSubmit={onSubmit}
        loading={loading}
        isEdit={true}
      />
    </ContentLayout>
  );
}
