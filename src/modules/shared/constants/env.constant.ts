import { z } from 'zod';

export const envSchema = z.object({
  VITE_APP_TITLE: z.string(),
  VITE_API_BASE_URL: z.string().url(),
  NODE_ENV: z
    .literal('development')
    .or(z.literal('production'))
    .or(z.literal('staging')),
});

export const env = (() => {
  const appTitle = envSchema.shape.VITE_APP_TITLE.parse(
    import.meta.env.VITE_APP_TITLE,
  );
  const apiBaseUrl = envSchema.shape.VITE_API_BASE_URL.parse(
    import.meta.env.VITE_API_BASE_URL,
  );
  const NODE_ENV = envSchema.shape.NODE_ENV.parse(import.meta.env.NODE_ENV);

  return {
    appTitle,
    apiBaseUrl,
    NODE_ENV,
  };
})();
