import { cn } from '@app/lib/utils';
import logoImg from '@assets/images/logo.png';
import registerBg from '@assets/images/register_bg.png';
import { authRepositories } from '@auth/apis/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import {
  type AuthRegisterRequestSchema,
  authRegisterRequestSchema,
} from '@modules/auth/schemas/register.schema';
import { dashboardPath } from '@modules/dashboard/routes';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Link } from '@shared/components/ui/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { BRAND_NAME, GENDER_OPTIONS } from '@shared/constants/general.constant';
import type { ErrorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '@shared/schemas/api.schema';
import { checkAuthUser } from '@shared/utils/checker.util';
import { HTTPError } from 'ky';
import { useEffect } from 'react';
import { FieldError, TextField } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';
import { json, redirect, useFetcher } from 'react-router-dom';
import { toast } from 'sonner';

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const payload = Object.fromEntries(await request.formData());

    // if `payload` is not correct, return error object
    const parsed = authRegisterRequestSchema.safeParse(payload);
    if (!parsed.success) return json(parsed.error, { status: 400 });

    try {
      // will throw if `register` returns 4xx/5xx error, therefore `errorElement` will be rendered
      const registerResponse = await authRepositories.register({
        json: parsed.data,
      });
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
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <img
        src={registerBg}
        alt="BG-Side of Register Page"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="Register Page Background"
      />
      <div className="relative z-10 bg-white shadow-2xl rounded-lg p-10 max-w-3xl w-full md:w-[600px]">
        {/* title register */}
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
          {t('auth_register_title')}
        </h2>

        <RegisterForm />

        <p className="py-4 text-center">
          <span className="text-base">{t('auth_alreadyHaveAccount')} </span>
          <Link className="hover:underline text-base" variant="link">
            {t('auth_loginHere')}
          </Link>
        </p>
      </div>
    </div>
  );
}

const RegisterForm = () => {
  const [t] = useI18n();
  const fetcher = useFetcher();
  const { control, formState } = useForm<AuthRegisterRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(authRegisterRequestSchema),
    defaultValues: {
      email: '',
      fullName: '',
      gender: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <fetcher.Form className="flex flex-col pt-3" method="POST">
      <div className="grid grid-cols-1 md:grid-cols-2 xs:gap-1 md:gap-4">
        {/* fullName */}
        <Controller
          control={control}
          name="fullName"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              className="group/fullName pt-4"
              validationBehavior="aria"
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={invalid}
              isRequired
            >
              <Label className="field-required">{t('auth_fullName')}</Label>
              <Input placeholder={t('ph_fullName')} ref={ref} />
              <FieldError className="text-destructive">
                {error?.message}
              </FieldError>
            </TextField>
          )}
        />

        {/* email */}
        <Controller
          control={control}
          name="email"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              className="group/email pt-4"
              validationBehavior="aria"
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={invalid}
              isRequired
            >
              <Label className="field-required">{t('auth_email')}</Label>
              <Input type="email" placeholder={t('ph_email')} ref={ref} />
              <FieldError className="text-destructive">
                {error?.message}
              </FieldError>
            </TextField>
          )}
        />

        {/* gender */}
        <Controller
          control={control}
          name="gender"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <div className="group/gender pt-4">
              <Label className="field-required">{t('auth_gender')}</Label>
              <Select
                name={name}
                onBlur={onBlur}
                ref={ref}
                selectedKey={value}
                onSelectionChange={onChange}
                isInvalid={invalid}
                isRequired
                placeholder={t('ph_gender')}
              >
                <FieldError className="text-destructive">
                  {error?.message}
                </FieldError>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopover>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => {
                      return (
                        <SelectItem key={option.value} id={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </SelectPopover>
              </Select>
            </div>
          )}
        />

        {/* phoneNumber */}
        <Controller
          control={control}
          name="phoneNumber"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <TextField
              className="group/phoneNumber pt-4"
              validationBehavior="aria"
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isInvalid={invalid}
              isRequired
            >
              <Label className="field-required">{t('auth_phoneNumber')}</Label>
              <Input placeholder={t('ph_phoneNumber')} ref={ref} />
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
            ? 'auth_registerLoading'
            : 'auth_register',
        )}{' '}
      </Button>
    </fetcher.Form>
  );
};
