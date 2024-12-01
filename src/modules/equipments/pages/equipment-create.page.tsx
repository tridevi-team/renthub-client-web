import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { equipmentRepositories } from '@modules/equipments/apis/equipment.api';
import { EquipmentForm } from '@modules/equipments/components/equipment-form';
import { equipmentPath } from '@modules/equipments/routes';
import {
  equipmentCreateRequestSchema,
  type EquipmentCreateRequestSchema,
  type EquipmentCreateResponseSchema,
} from '@modules/equipments/schema/equiment.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import {
  EQUIPMENT_SHARED_TYPE,
  EQUIPMENT_STATUS,
} from '@shared/constants/general.constant';
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
  const form = useForm<EquipmentCreateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(equipmentCreateRequestSchema),
    defaultValues: {
      code: '',
      status: EQUIPMENT_STATUS.NORMAL,
      sharedType: EQUIPMENT_SHARED_TYPE.ROOM,
    },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const onSubmit = async (values: any) => {
    console.log('values:', values);
    setLoading(true);
    const [err, _]: AwaitToResult<EquipmentCreateResponseSchema> = await to(
      equipmentRepositories.create({
        equipment: values,
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
    toast.success(t('ms_create_equipment_success'));
    navigate(`${equipmentPath.root}`);
    return _;
  };

  return (
    <ContentLayout title={t('equipment_create_title')} pathname={pathname}>
      <EquipmentForm form={form} onSubmit={onSubmit} loading={loading} />
    </ContentLayout>
  );
}
