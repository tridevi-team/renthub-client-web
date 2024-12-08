import { z } from 'zod';

export const envSchema = z.object({
  VITE_APP_TITLE: z.string(),
  VITE_API_BASE_URL: z.string().url(),
  VITE_NODE_ENV: z.string(),
  VITE_API_PROVINCE_URL: z.string().url(),
  VITE_API_BASE_UPLOAD_URL: z.string().url(),
  VITE_CKEDITOR_LICENSE_KEY: z.string().optional(),
});

export const env = (() => {
  const appTitle = envSchema.shape.VITE_APP_TITLE.parse(
    import.meta.env.VITE_APP_TITLE,
  );
  const apiBaseUrl = envSchema.shape.VITE_API_BASE_URL.parse(
    import.meta.env.VITE_API_BASE_URL,
  );
  const apiBaseUploadUrl = envSchema.shape.VITE_API_BASE_UPLOAD_URL.parse(
    import.meta.env.VITE_API_BASE_UPLOAD_URL,
  );
  const apiProvinceUrl = envSchema.shape.VITE_API_PROVINCE_URL.parse(
    import.meta.env.VITE_API_PROVINCE_URL,
  );
  const VITE_NODE_ENV = envSchema.shape.VITE_NODE_ENV.parse(
    import.meta.env.VITE_NODE_ENV,
  );
  const ckeditorLicenseKey = envSchema.shape.VITE_CKEDITOR_LICENSE_KEY.parse(
    import.meta.env.VITE_CKEDITOR_LICENSE_KEY,
  );

  return {
    appTitle,
    apiBaseUrl,
    apiBaseUploadUrl,
    apiProvinceUrl,
    VITE_NODE_ENV,
    ckeditorLicenseKey,
  };
})();
