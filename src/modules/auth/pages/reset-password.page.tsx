import { useEmailStore } from '@app/stores';
import { authRepositories } from '@auth/apis/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { ResendCodeButton } from '@modules/auth/components/resend-button';
import { authPath } from '@modules/auth/routes';
import {
  type AuthResetPasswordRequestSchema,
  authResetPasswordRequestSchema,
} from '@modules/auth/schemas/auth.schema';
import { dashboardPath } from '@modules/dashboard/routes';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Link } from '@shared/components/ui/link';
import { messageLocale } from '@shared/hooks/use-i18n/locales/vi/message.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { checkAuthUser } from '@shared/utils/checker.util';
import { HTTPError } from 'ky';
import { FieldError, TextField } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';
import { json, redirect, useFetcher } from 'react-router-dom';
import { toast } from 'sonner';

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const payload = Object.fromEntries(await request.formData());

    const parsed = authResetPasswordRequestSchema.safeParse({
      ...payload,
      email: useEmailStore.getState().data?.email,
    });
    if (!parsed.success) return json(parsed.error, { status: 400 });

    try {
      await authRepositories.resetPassword({ json: parsed.data });

      useEmailStore.getState().setData(null);
      toast.success(messageLocale.ms_resetPasswordSuccess);
      return redirect(authPath.login);
    } catch (error) {
      if (error instanceof HTTPError) {
        const response = (await error.response.json()) as ErrorResponseSchema;
        return json(response);
      }
    }
  }

  toast.warning('Not Implemented');
  return new Response('Not Implemented', { status: 501 });
};

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const { target } = useEmailStore.getState().data ?? {};
  const isShouldResetPassword = target === 'forgot-password';

  if (authed) {
    return redirect(dashboardPath.root);
  }
  if (!isShouldResetPassword) {
    return redirect(authPath.login);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();

  return (
    <>
      <p className="text-center text-base text-secondary-foreground px-20">
        {t('auth_resetPassword_guide')}
      </p>

      <ResetPasswordForm />

      <ResendCodeButton />

      <p className="py-12 text-center">
        <span className="text-base">{t('auth_rememberedPassword')} </span>
        <Link
          aria-label={t('auth_loginHere')}
          className="hover:underline text-base"
          href={authPath.login}
          variant="link"
        >
          {t('auth_loginHere')}
        </Link>
      </p>
    </>
  );
}

const ResetPasswordForm = () => {
  const [t] = useI18n();
  const fetcher = useFetcher();
  const { control, formState } = useForm<AuthResetPasswordRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(authResetPasswordRequestSchema),
    defaultValues: {
      email: useEmailStore.getState().data?.email ?? '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <fetcher.Form
      className="flex flex-col pt-3 md:pt-8 px-12 md:px-20"
      method="POST"
    >
      {/* code */}
      <Controller
        control={control}
        name="code"
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <TextField
            className="group/code pt-4"
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label className="field-required">{t('auth_code')}</Label>
            <Input placeholder={t('ph_code')} ref={ref} />
            <FieldError className="text-destructive">
              {error?.message}
            </FieldError>
          </TextField>
        )}
      />

      {/* password */}
      <Controller
        control={control}
        name="password"
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <TextField
            className="group/password pt-4"
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label className="field-required">{t('auth_password')}</Label>
            <Input type="password" placeholder={t('ph_password')} ref={ref} />
            <FieldError className="text-destructive">
              {error?.message}
            </FieldError>
          </TextField>
        )}
      />

      {/* confirmPassword */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <TextField
            className="group/confirmPassword pt-4"
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label className="field-required">
              {t('auth_confirmPassword')}
            </Label>
            <Input
              type="password"
              placeholder={t('ph_confirmPassword')}
              ref={ref}
            />
            <FieldError className="text-destructive">
              {error?.message}
            </FieldError>
          </TextField>
        )}
      />

      {fetcher.data && (
        <div
          role="alert"
          aria-label="Fetcher error alert"
          className="mt-2 bg-destructive text-destructive-foreground p-2 rounded-md flex items-center gap-x-2 shadow-md w-full"
        >
          <Icon icon="lucide:alert-circle" />
          <p>{t(`${(fetcher.data as ErrorResponseSchema).code}`)}</p>
        </div>
      )}

      <Button
        type="submit"
        className="mt-2"
        loading={fetcher.state === 'submitting'}
        disabled={fetcher.state === 'submitting' || !formState.isValid}
      >
        {t('auth_resetPassword')}
      </Button>
    </fetcher.Form>
  );
};