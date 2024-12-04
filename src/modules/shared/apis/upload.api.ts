import { http } from '@shared/services/http.service';

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
    const resp = http.instance
      .post('uploads', { body: data })
      .json<FileUploadResponse>();

    return resp;
  },
};
