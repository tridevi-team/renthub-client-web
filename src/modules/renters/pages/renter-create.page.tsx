import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { renterRepositories } from '@modules/renters/apis/renter.api';
import { RenterForm } from '@modules/renters/components/renter-form';
import { renterPath } from '@modules/renters/routes';
import {
  type RenterFormRequestSchema,
  renterFormRequestSchema,
} from '@modules/renters/schema/renter.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import to from 'await-to-js';
import dayjs from 'dayjs';
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
    module: 'equipment',
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
  const form = useForm<RenterFormRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(renterFormRequestSchema),
    defaultValues: {
      gender: 'male',
      tempReg: 'YES',
      represent: 'NO',
    },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const onSubmit = async (values: any) => {
    const { roomId, tempReg, represent, ...rest } = values;
    if (!roomId) {
      toast.error(t('ms_room_required'));
    }
    setLoading(true);
    const [err, _]: AwaitToResult<any> = await to(
      renterRepositories.create({
        roomId: roomId,
        data: {
          ...rest,
          birthday: dayjs(rest.birthday).format('YYYY-MM-DD'),
          tempReg: tempReg === 'YES',
          represent: represent === 'YES',
        },
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
    toast.success(t('ms_create_renter_success'));
    navigate(`${renterPath.root}`);
    return _;
  };

  return (
    <ContentLayout title={t('renter_create_title')} pathname={pathname}>
      <div className="sm:mx-10 lg:mx-36">
        <RenterForm form={form} onSubmit={onSubmit} loading={loading} />
      </div>
    </ContentLayout>
  );
}
