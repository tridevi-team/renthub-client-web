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
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { checkAuthUser } from '@shared/utils/checker.util';
import { HTTPError } from 'ky';
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

      return redirect(dashboardPath.root);
    } catch (error) {
      if (error instanceof HTTPError) {
        const response = (await error.response.json()) as ErrorResponseSchema;
        if (response.code === 'VERIFY_ACCOUNT_FIRST') {
          useEmailStore.getState().setData({
            email,
            target: 'verify-account',
            status: 'code-sent',
          });
          await authRepositories.resendVerifyCode({ json: { email } });
          return redirect(authPath.verifyAccount);
        }
        return json(response);
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
      <p className="text-center text-base text-secondary-foreground">
        {t('auth_welcome')}
      </p>

      <LoginForm />

      <p className="py-12 text-center">
        <span className="text-base">{t('auth_noAccount')} </span>
        <Link
          variant="link"
          href={authPath.register}
          className="hover:underline text-base"
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
      className="flex flex-col pt-3 md:pt-8 px-12 md:px-20"
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
            type="password"
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label className="field-required">{t('auth_password')}</Label>
            <Input placeholder={t('ph_password')} ref={ref} />
            <Link
              href={authPath.forgotPassword}
              variant="link"
              className="float-end mt-2 -mr-3"
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
          className="mt-2 bg-destructive text-destructive-foreground p-2 rounded-md flex items-center gap-x-2 shadow-md w-full"
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
