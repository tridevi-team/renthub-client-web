import { zodResolver } from '@hookform/resolvers/zod';
import { authPath } from '@modules/auth/routes';
import { contractTemplateRepositories } from '@modules/contract-templates/api/contract-template.api';
import { ContractTemplateForm } from '@modules/contract-templates/components/contract-template-form';
import { contractTemplatePath } from '@modules/contract-templates/routes';
import {
  contractTemplateCreateRequestSchema,
  type ContractTemplateCreateRequestSchema,
  type ContractTemplateCreateResponseSchema,
} from '@modules/contract-templates/schemas/contract-template.schema';
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
    module: 'contract',
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
  const form = useForm<ContractTemplateCreateRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(contractTemplateCreateRequestSchema),
    defaultValues: {
      isActive: true,
    },
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const onSubmit = async (values: any) => {
    setLoading(true);
    const [err, _]: AwaitToResult<ContractTemplateCreateResponseSchema> =
      await to(
        contractTemplateRepositories.create({
          contractTemplate: values,
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
    toast.success(t('ms_create_contract_template_success'));
    navigate(`${contractTemplatePath.root}`);
    return _;
  };

  return (
    <ContentLayout title={t('contract_t_create_title')} pathname={pathname}>
      <ContractTemplateForm form={form} onSubmit={onSubmit} loading={loading} />
    </ContentLayout>
  );
}
