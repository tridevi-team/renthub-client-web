import { cn } from '@app/lib/utils';
import { useEmailStore } from '@app/stores';
import logoImg from '@assets/images/logo.png';
import bgImg from '@assets/images/register_bg.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { authRepositories } from '@modules/auth/apis/auth.api';
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
import { BRAND_NAME } from '@shared/constants/general.constant';
import { messageLocale } from '@shared/hooks/use-i18n/locales/vi/message.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { checkAuthUser } from '@shared/utils/checker.util';
import { HTTPError } from 'ky';
import { useEffect, useState } from 'react';
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
      await authRepositories.veryfyAccount({
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
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <img
        src={bgImg}
        alt="BG-Side of Verify Email Page"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Verify Email Page Background"
      />
      <div className="relative z-10 bg-white shadow-2xl rounded-lg p-10 max-w-3xl w-full md:w-[600px]">
        {/* title verify email */}
        <div className="flex items-center gap-2 justify-center mb-2 md:-mt-24">
          <img
            src={logoImg}
            alt={BRAND_NAME}
            className={cn('w-28 h-28', 'rounded-full')}
            loading="lazy"
            aria-label={BRAND_NAME}
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">
          {t('auth_verifyEmail_title')}
        </h2>
        <p className="text-center text-base text-secondary-foreground px-5">
          {t('auth_codeSend_1')}
          <b>{useEmailStore.getState().data?.email}</b>
          {t('auth_codeSend_2')}
        </p>

        <VerifyEmailForm />

        <ResendCodeButton />

        <p className="py-4 text-center">
          <span className="text-base">{t('auth_alreadyHaveAccount')} </span>
          <Link
            className="hover:underline text-base"
            variant="link"
            href={authPath.login}
          >
            {t('auth_loginHere')}
          </Link>
        </p>
      </div>
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
          className="mt-2 bg-destructive text-destructive-foreground p-2 rounded-md flex items-center gap-x-2 shadow-md w-full"
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

const ResendCodeButton = () => {
  const [t] = useI18n();
  const [timeLeft, setTimeLeft] = useState<number>(100);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
    setIsDisabled(false);
  }, [timeLeft]);

  const handleResendCode = async () => {
    setIsDisabled(true);
    setTimeLeft(180);
    const email = useEmailStore.getState().data?.email;
    if (!email) {
      return redirect(authPath.login);
    }

    try {
      setLoading(true);
      await authRepositories.resendVerifyCode({
        json: {
          email,
        },
      });
      setLoading(false);
      toast.info(t('ms_resendCodeSuccess'));
    } catch (error) {
      setLoading(false);
      return toast.error(t('ms_codeResendFailed'));
    }
  };

  return (
    <div className="text-center mt-4">
      <Button
        type="button"
        onClick={handleResendCode}
        disabled={isDisabled}
        variant="link"
        loading={loading}
      >
        {isDisabled
          ? `${t('auth_resendCode')} (${Math.floor(timeLeft / 60)}:${(
              timeLeft % 60
            )
              .toString()
              .padStart(2, '0')})`
          : t('auth_resendCode')}
      </Button>
    </div>
  );
};
