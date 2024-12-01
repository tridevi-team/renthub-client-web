import { useEmailStore } from '@app/stores';
import { authRepositories } from '@auth/apis/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { authPath } from '@modules/auth/routes';
import {
  type AuthRegisterRequestSchema,
  authRegisterRequestSchema,
} from '@modules/auth/schemas/register.schema';
import { dashboardPath } from '@modules/dashboard/routes';
import { For } from '@shared/components/for';
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
import { GENDER_OPTIONS } from '@shared/constants/general.constant';
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

    const parsed = authRegisterRequestSchema.safeParse(payload);
    if (!parsed.success) return json(parsed.error, { status: 400 });

    try {
      await authRepositories.register({
        json: parsed.data,
      });
      unstable_batchedUpdates(() => {
        useEmailStore.getState().setData({
          email: parsed.data.email,
          target: 'verify-account',
          status: 'code-sent',
        });
      });
      toast.info(messageLocale.ms_register_success);
      return redirect(authPath.verifyAccount);
    } catch (error) {
      if (isErrorResponseSchema(error)) {
        return json(error);
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

  return (
    <div>
      <h2 className="mb-4 text-center font-bold text-3xl">
        {t('auth_register_title')}
      </h2>

      <RegisterForm />

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
      <div className="grid grid-cols-1 xs:gap-1 md:grid-cols-2 md:gap-4">
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopover>
                  <SelectContent>
                    <For
                      each={GENDER_OPTIONS}
                      fallback={<p>{t('common_no_item')}</p>}
                    >
                      {(option) => (
                        <SelectItem key={option.value} id={option.value}>
                          {option.label}
                        </SelectItem>
                      )}
                    </For>
                  </SelectContent>
                </SelectPopover>
              </Select>
              <FieldError className="text-destructive">
                {error?.message}
              </FieldError>
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
              <Input placeholder={t('ph_phone_number')} ref={ref} />
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
                placeholder={t('ph_confirm_password')}
                ref={ref}
                customType="password"
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
            ? 'auth_registerLoading'
            : 'auth_register',
        )}{' '}
      </Button>
    </fetcher.Form>
  );
};
