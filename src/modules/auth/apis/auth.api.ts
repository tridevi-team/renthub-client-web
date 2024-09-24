import {
  type AuthLoginRequestSchema,
  type AuthLoginResponseSchema,
  authLoginResponseSchema,
} from '@modules/auth/schemas/login.schema';
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

                if ('token' in data) {
                  // set 'Authorization' headers
                  request.headers.set('Authorization', `Bearer ${data.token}`);
                }
              }
            },
          ],
        },
      })
      .json<AuthLoginResponseSchema>();

    return authLoginResponseSchema.parse(resp);
  },
} as const;
