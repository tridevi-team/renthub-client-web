import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { PERMISSION_KEY } from '@modules/auth/schemas/auth.schema';
import { roleRepositories } from '@modules/roles/apis/role.api';
import { RoleForm } from '@modules/roles/components/role-form';
import { rolePath } from '@modules/roles/routes';
import {
  type RoleCreateRequestSchema,
  roleCreateRequestSchema,
  type RoleCreateResponseSchema,
} from '@modules/roles/schema/role.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
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
    module: 'role',
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
  const form = useForm<RoleCreateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(roleCreateRequestSchema),
    defaultValues: {
      permissions: Object.fromEntries(
        Object.values(PERMISSION_KEY).map((key) => [
          key,
          {
            read: false,
            create: false,
            update: false,
            delete: false,
          },
        ]),
      ),
    },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const onSubmit = async (values: RoleCreateRequestSchema) => {
    setLoading(true);
    const [err, _]: AwaitToResult<RoleCreateResponseSchema> = await to(
      roleRepositories.create({
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
    toast.success(t('ms_create_role_success'));
    navigate(`${rolePath.root}`);
    return _;
  };

  return (
    <ContentLayout title={t('role_create_title')} pathname={pathname}>
      <RoleForm form={form} onSubmit={onSubmit} loading={loading} />
    </ContentLayout>
  );
}
