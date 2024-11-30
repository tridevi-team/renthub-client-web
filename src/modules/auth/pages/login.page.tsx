import { useEmailStore } from '@app/stores';
import { authRepositories } from '@auth/apis/auth.api';
import { useAuthUserStore } from '@auth/hooks/use-auth-user-store.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { authPath } from '@modules/auth/routes';
import {
  type AuthLoginRequestSchema,
  authLoginRequestSchema,
} from '@modules/auth/schemas/login.schema';
import { dashboardPath } from '@modules/dashboard/routes';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Link } from '@shared/components/ui/link';
import { messageLocale } from '@shared/hooks/use-i18n/locales/vi/message.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { checkAuthUser } from '@shared/utils/checker.util';
import { isErrorResponseSchema } from '@shared/utils/type-guards';
import { FieldError, TextField } from 'react-aria-components';
import { unstable_batchedUpdates } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';
import { json, redirect, useFetcher } from 'react-router-dom';
import { toast } from 'sonner';

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const payload = Object.fromEntries(await request.formData());

    const parsed = authLoginRequestSchema.safeParse(payload);
    if (!parsed.success) return json(parsed.error, { status: 400 });

    const email = parsed.data.username;

    try {
      const loginResponse = await authRepositories.login({ json: parsed.data });

      const user = loginResponse.data;

      unstable_batchedUpdates(() => {
        useAuthUserStore.getState().setUser(user);
      });
      toast.success(messageLocale.ms_login_success);
      return redirect(dashboardPath.root);
    } catch (error) {
      if (isErrorResponseSchema(error)) {
        if (error.code === 'VERIFY_ACCOUNT_FIRST') {
          useEmailStore.getState().setData({
            email,
            target: 'verify-account',
            status: 'code-sent',
          });
          await authRepositories.resendVerifyCode({ json: { email } });
          return redirect(authPath.verifyAccount);
        }
        return json(error);
      }
    }
  }

  toast.warning('Not Implemented');
  return new Response('Not Implemented', { status: 501 });
};

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();

  if (authed) {
    return redirect(dashboardPath.root);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();

  return (
    <div>
      <p className=" text-center font-bold text-base text-primary">
        {t('auth_welcome')}
      </p>
      <p className="text-center text-base text-secondary-foreground">
        {t('auth_login_to_continue')}
      </p>
      <LoginForm />

      <p className="py-12 text-center">
        <span className="text-base">{t('auth_noAccount')} </span>
        <Link
          variant="link"
          href={authPath.register}
          className="text-base hover:underline"
          aria-label={t('auth_registerHere')}
        >
          {t('auth_registerHere')}
        </Link>
      </p>
    </div>
  );
}

const LoginForm = () => {
  const [t] = useI18n();
  const fetcher = useFetcher();
  const { control, formState } = useForm<AuthLoginRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(authLoginRequestSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  return (
    <fetcher.Form
      className="flex flex-col px-12 pt-3 md:px-20 md:pt-8"
      method="POST"
    >
      {/* username */}
      <Controller
        control={control}
        name="username"
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <TextField
            className="group/username pt-4"
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label className="field-required">{t('auth_email')}</Label>
            <Input placeholder={t('ph_username')} ref={ref} />
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
            <Input
              placeholder={t('ph_password')}
              ref={ref}
              customType="password"
            />
            <Link
              href={authPath.forgotPassword}
              variant="link"
              className="-mr-3 float-end mt-2"
            >
              {t('auth_forgotPassword')}
            </Link>
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
          className="mt-2 flex w-full items-center gap-x-2 rounded-md bg-destructive p-2 text-destructive-foreground shadow-md"
        >
          <Icon icon="lucide:alert-circle" />
          <p>{t(`${(fetcher.data as ErrorResponseSchema).code}`)}</p>
        </div>
      )}

      <Button
        type="submit"
        className="mt-2"
        disabled={fetcher.state === 'submitting' || !formState.isValid}
      >
        {t(
          fetcher.state === 'submitting' ? 'auth_loginLoading' : 'auth_login',
        )}{' '}
      </Button>
    </fetcher.Form>
  );
};
