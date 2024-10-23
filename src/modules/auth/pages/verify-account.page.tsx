import { useEmailStore } from '@app/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { authRepositories } from '@modules/auth/apis/auth.api';
import { ResendCodeButton } from '@modules/auth/components/resend-button';
import { authPath } from '@modules/auth/routes';
import {
  type AuthVerifyEmailRequestSchema,
  authVerifyEmailRequestSchema,
} from '@modules/auth/schemas/register.schema';
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
import { unstable_batchedUpdates } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';
import { json, redirect, useFetcher } from 'react-router-dom';
import { toast } from 'sonner';

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const payload = Object.fromEntries(await request.formData());

    const parsed = authVerifyEmailRequestSchema.safeParse({
      ...payload,
      email: useEmailStore.getState().data?.email,
    });
    if (!parsed.success) return json(parsed.error, { status: 400 });
    try {
      await authRepositories.verifyAccount({
        json: parsed.data,
      });

      unstable_batchedUpdates(() => {
        useEmailStore.getState().setData(null);
      });

      toast.info(messageLocale.ms_verifySuccess);
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
  const isEmailStored = useEmailStore.getState().data?.email;
  const isVerified = useEmailStore.getState().data?.status === 'code-verified';

  if (authed) {
    return redirect(dashboardPath.root);
  }

  if (!isEmailStored || isVerified) {
    return redirect(authPath.login);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();

  return (
    <div>
      <h2 className="mb-4 text-center font-bold text-3xl">
        {t('auth_verifyEmail_title')}
      </h2>
      <p className="px-5 text-center text-base text-secondary-foreground">
        {t('auth_codeSend_1')}
        <b>{useEmailStore.getState().data?.email}</b>
        {t('auth_codeSend_2')}
      </p>

      <VerifyEmailForm />

      <ResendCodeButton />

      <p className="py-4 text-center">
        <span className="text-base">{t('auth_alreadyHaveAccount')} </span>
        <Link
          className="text-base hover:underline"
          variant="link"
          href={authPath.login}
        >
          {t('auth_loginHere')}
        </Link>
      </p>
    </div>
  );
}

const VerifyEmailForm = () => {
  const [t] = useI18n();
  const fetcher = useFetcher();
  const { control, formState } = useForm<AuthVerifyEmailRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(authVerifyEmailRequestSchema),
    defaultValues: {
      email: useEmailStore.getState().data?.email ?? '',
      verifyCode: '',
    },
  });

  return (
    <fetcher.Form className="flex flex-col pt-3" method="POST">
      <div className="grid grid-cols-1 xs:gap-1 md:gap-4">
        {/* verifyCode */}
        <Controller
          control={control}
          name="verifyCode"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              className="group/verifyCode pt-4"
              validationBehavior="aria"
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={invalid}
              isRequired
            >
              <Label className="field-required">{t('auth_code')}</Label>
              <Input
                ref={ref}
                type="number"
                inputMode="numeric"
                className="text-center"
                placeholder={t('ph_code')}
              />
              <FieldError className="text-destructive">
                {error?.message}
              </FieldError>
            </TextField>
          )}
        />
      </div>

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
        className="mt-4"
        disabled={fetcher.state === 'submitting' || !formState.isValid}
      >
        {t(
          fetcher.state === 'submitting'
            ? 'auth_verifyEmailLoading'
            : 'auth_verifyEmail',
        )}{' '}
      </Button>
    </fetcher.Form>
  );
};
