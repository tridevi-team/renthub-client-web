import {
  authForgotPasswordResponseSchema,
  authResetPasswordResponseSchema,
  type AuthForgotPasswordRequestSchema,
  type AuthForgotPasswordResponseSchema,
  type AuthResetPasswordResponseSchema,
} from '@modules/auth/schemas/auth.schema';
import {
  authLoginResponseSchema,
  type AuthLoginRequestSchema,
  type AuthLoginResponseSchema,
} from '@modules/auth/schemas/login.schema';
import {
  authRegisterResponseSchema,
  authResendCodeResponseSchema,
  authVerifyEmailResponseSchema,
  type AuthRegisterRequestSchema,
  type AuthRegisterResponseSchema,
  type AuthResendCodeRequestSchema,
  type AuthResendCodeResponseSchema,
  type AuthVerifyEmailRequestSchema,
  type AuthVerifyEmailResponseSchema,
} from '@modules/auth/schemas/register.schema';
import { http } from '@shared/services/http.service';

export const authKeys = {
  all: ['auth'] as const,
  login: (params: AuthLoginRequestSchema | undefined) =>
    [...authKeys.all, 'login', ...(params ? [params] : [])] as const,
};

export const authRepositories = {
  /**
   * @url POST ${env.apiBaseUrl}/auth/login
   * @note could throw error in `HttpError` or `ZodError` error
   */
  login: async ({ json }: { json: AuthLoginRequestSchema }) => {
    const resp = await http.instance
      .post('auth/login', {
        json,
        hooks: {
          afterResponse: [
            async (request, _options, response) => {
              if (response.status === 200) {
                const data = (await response.json()) as AuthLoginResponseSchema;

                if ('accessToken' in data) {
                  request.headers.set(
                    'Authorization',
                    `Bearer ${data.accessToken}`,
                  );
                }
              }
            },
          ],
        },
      })
      .json<AuthLoginResponseSchema>();

    return authLoginResponseSchema.parse(resp);
  },
  register: async ({ json }: { json: AuthRegisterRequestSchema }) => {
    const resp = await http.instance
      .post('auth/signup', { json })
      .json<AuthRegisterResponseSchema>();

    return authRegisterResponseSchema.parse(resp);
  },
  verifyAccount: async ({ json }: { json: AuthVerifyEmailRequestSchema }) => {
    const resp = await http.instance
      .put('auth/verify-account', { json })
      .json<AuthVerifyEmailResponseSchema>();

    return authVerifyEmailResponseSchema.parse(resp);
  },
  resendVerifyCode: async ({ json }: { json: AuthResendCodeRequestSchema }) => {
    const resp = await http.instance
      .put('auth/resend-code', { json })
      .json<AuthResendCodeResponseSchema>();

    return authResendCodeResponseSchema.parse(resp);
  },
  forgotPassword: async ({
    json,
  }: { json: AuthForgotPasswordRequestSchema }) => {
    const resp = await http.instance
      .post('auth/forgot-password', { json })
      .json<AuthForgotPasswordResponseSchema>();

    return authForgotPasswordResponseSchema.parse(resp);
  },
  resetPassword: async ({
    json,
  }: { json: AuthForgotPasswordRequestSchema }) => {
    const resp = await http.instance
      .put('auth/reset-password', { json })
      .json<AuthResetPasswordResponseSchema>();

    return authResetPasswordResponseSchema.parse(resp);
  },
} as const;
