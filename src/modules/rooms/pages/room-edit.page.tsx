import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { roleRepositories } from '@modules/roles/apis/role.api';
import { RoleForm } from '@modules/roles/components/role-form';
import { rolePath } from '@modules/roles/routes';
import {
  type RoleDetailResponseSchema,
  type RoleUpdateRequestSchema,
  roleUpdateRequestSchema,
  type RoleUpdateResponseSchema,
} from '@modules/roles/schema/role.schema';
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
  const form = useForm<RoleUpdateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(roleUpdateRequestSchema),
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchRole = async () => {
      if (!id) return;
      const [err, role]: AwaitToResult<RoleDetailResponseSchema> = await to(
        roleRepositories.detail({ id }),
      );
      if (err) {
        toast.error(t('UNKNOWN_ERROR'));
        return;
      }
      form.reset({
        ...role?.data,
        status: role?.data.status === 1 ? 'active' : 'inactive',
      });
    };
    fetchRole();
  }, [id, form, t]);

  const onSubmit = async (values: RoleUpdateRequestSchema) => {
    if (!id) return;
    setLoading(true);
    const [err, _]: AwaitToResult<RoleUpdateResponseSchema> = await to(
      roleRepositories.update({
        id,
        role: values,
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
    toast.success(t('ms_update_role_success'));
    navigate(`${rolePath.root}`);
    return _;
  };

  return (
    <ContentLayout title={t('role_edit_title')} pathname={pathname}>
      <RoleForm form={form} onSubmit={onSubmit} loading={loading} isEdit />
    </ContentLayout>
  );
}
