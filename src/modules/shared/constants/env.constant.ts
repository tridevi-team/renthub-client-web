import { z } from 'zod';

export const envSchema = z.object({
  VITE_APP_TITLE: z.string(),
  VITE_API_BASE_URL: z.string().url(),
  VITE_NODE_ENV: z.string(),
});

export const env = (() => {
  const appTitle = envSchema.shape.VITE_APP_TITLE.parse(
    import.meta.env.VITE_APP_TITLE,
  );
  const apiBaseUrl = envSchema.shape.VITE_API_BASE_URL.parse(
    import.meta.env.VITE_API_BASE_URL,
  );
  const VITE_NODE_ENV = envSchema.shape.VITE_NODE_ENV.parse(
    import.meta.env.VITE_NODE_ENV,
  );

  return {
    appTitle,
    apiBaseUrl,
    VITE_NODE_ENV,
  };
})();
