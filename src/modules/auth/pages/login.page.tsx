import reactjs from '@assets/images/reactjs.svg';
import {
  authLoginRequestSchema,
  authRepositories,
  type AuthLoginRequestSchema,
} from '@auth/apis/auth.api';
import { useAuthUserStore } from '@auth/hooks/use-auth-user-store.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { dashboardPath } from '@modules/dashboard/routes';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Link } from '@shared/components/ui/link';
import type { ErrorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { checkAuthUser } from '@shared/utils/checker.util';
import { HTTPError } from 'ky';
import { useEffect } from 'react';
import { FieldError, TextField } from 'react-aria-components';
import { unstable_batchedUpdates } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';
import { json, redirect, useFetcher } from 'react-router-dom';
import { toast } from 'sonner';

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const payload = Object.fromEntries(await request.formData());

    // if `payload` is not correct, return error object
    const parsed = authLoginRequestSchema.safeParse(payload);
    if (!parsed.success) return json(parsed.error, { status: 400 });

    try {
      // will throw if `login` returns 4xx/5xx error, therefore `errorElement` will be rendered
      const loginResponse = await authRepositories.login({ json: parsed.data });

      // see https://docs.pmnd.rs/zustand/recipes/recipes#calling-actions-outside-a-react-event-handler
      unstable_batchedUpdates(() => {
        useAuthUserStore.getState().setUser(loginResponse); // set user data to store
      });
      return redirect(dashboardPath.root);
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

  // redirect auth user to home
  if (authed) {
    // toast.info('Already Logged In');
    return redirect(dashboardPath.root);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();

  useEffect(() => {
    const toastMessage: ErrorLocale = sessionStorage.getItem(
      'toastMessage',
    ) as ErrorLocale;
    if (toastMessage) {
      toast.error(t(toastMessage));
      sessionStorage.removeItem('toastMessage');
    }
  }, [t]);

  return (
    <div className="min-h-screen w-full flex">
      {/* form */}
      <section className="min-h-screen w-full flex flex-col justify-center px-10 xl:px-20 md:w-1/2">
        <h1 className="text-center text-3xl text-primary">
          {t('auth_welcome')}
        </h1>

        <LoginForm />

        <p className="py-12 text-center">
          {t('auth_noAccount')}{' '}
          <Link
            aria-label={t('auth_registerHere')}
            className="hover:underline"
            href="/does-not-exists"
            variant="link"
          >
            {t('auth_registerHere')}
          </Link>
        </p>
      </section>

      {/* image */}
      <section className="hidden md:block w-1/2 shadow-2xl">
        <span className="relative h-screen w-full md:flex md:items-center md:justify-center">
          <img
            src={reactjs}
            alt="cool react logo with rainbow shadow"
            loading="lazy"
            className="h-full object-cover"
            aria-label="cool react logo"
          />
        </span>
      </section>
    </div>
  );
}

function LoginForm() {
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
    <fetcher.Form className="flex flex-col pt-3 md:pt-8" method="POST">
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
            // Let React Hook Form handle validation instead of the browser.
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label>{t('auth_username')}</Label>
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
            // Let React Hook Form handle validation instead of the browser.
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label>{t('auth_password')}</Label>
            <Input type="password" placeholder={t('ph_password')} ref={ref} />
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
          <p>{(fetcher.data as ErrorResponseSchema).message}</p>
        </div>
      )}

      <Button
        type="submit"
        className="mt-8"
        disabled={fetcher.state === 'submitting' || !formState.isValid}
      >
        {t(
          fetcher.state === 'submitting' ? 'auth_loginLoading' : 'auth_login',
        )}{' '}
      </Button>
    </fetcher.Form>
  );
}
