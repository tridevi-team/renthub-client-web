import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { equipmentRepositories } from '@modules/equipments/apis/equipment.api';
import { EquipmentForm } from '@modules/equipments/components/equipment-form';
import { equipmentPath } from '@modules/equipments/routes';
import {
  equipmentUpdateRequestSchema,
  type EquipmentUpdateRequestSchema,
} from '@modules/equipments/schema/equiment.schema';
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

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const hasPermission = checkPermissionPage({
    module: 'equipment',
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
  const form = useForm<EquipmentUpdateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(equipmentUpdateRequestSchema),
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { id } = useParams<{ id: string }>();

  const fetchDetail = async () => {
    if (!id) return;
    const [err, resp]: AwaitToResult<any> = await to(
      equipmentRepositories.detail({ id }),
    );
    if (err) {
      toast.error(t('UNKNOWN_ERROR'));
      return;
    }
    form.reset({
      ...resp?.data,
    });
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const onSubmit = async (values: any) => {
    if (!id) return;
    setLoading(true);
    for (const key in values)
      if (!values[key] && values[key] !== 0) delete values[key];
    const [err, _]: AwaitToResult<any> = await to(
      equipmentRepositories.update({
        id,
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
    toast.success(t('ms_update_equipment_success'));
    navigate(`${equipmentPath.root}`);
    return _;
  };

  return (
    <ContentLayout title={t('role_edit_title')} pathname={pathname}>
      <EquipmentForm form={form} onSubmit={onSubmit} loading={loading} isEdit />
    </ContentLayout>
  );
}
