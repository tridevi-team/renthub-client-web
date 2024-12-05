import { navigate } from '@app/providers/router/navigation';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { errorResponseSchema } from '@modules/shared/schemas/api.schema';
import { env } from '@shared/constants/env.constant';
import ky, { HTTPError } from 'ky';

export type FileUploadResponse = {
  success: boolean;
  code: string;
  message: string;
  data: {
    files: {
      url: string;
      file: string;
    }[];
  };
};

export const fileRepositories = {
  upload: async (data: FormData) => {
    const resp = ky
      .post(env.apiBaseUploadUrl, {
        body: data,
        hooks: {
          beforeRequest: [
            async (request) => {
              const accessToken = useAuthUserStore.getState().user?.accessToken;
              if (accessToken) {
                request.headers.set('Authorization', `Bearer ${accessToken}`);
              }
            },
          ],
          afterResponse: [
            async (_request, _options, response) => {
              if (response.status === 401) {
                useAuthUserStore.getState().clearUser();
                navigate('/login');
              }

              if (!response.ok) {
                const errorResponse = await response.json();
                const parsedError =
                  errorResponseSchema.safeParse(errorResponse);
                if (!parsedError.success) {
                  throw new HTTPError(response, _request, _options);
                }
                throw parsedError.data;
              }
            },
          ],
        },
      })
      .json<FileUploadResponse>();

    return resp;
  },
};
