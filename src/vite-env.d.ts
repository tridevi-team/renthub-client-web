/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />

interface ImportMetaEnv {
  // prefixed with "VITE_" -> exposed to our Vite-processed code
  readonly VITE_APP_TITLE: string | undefined;
  readonly VITE_API_BASE_URL: string | undefined;
  readonly VITE_NODE_ENV: 'development' | 'production' | 'test';
  readonly VITE_API_PROVINCE_URL: string | undefined;
  readonly VITE_API_BASE_UPLOAD_URL: string | undefined;
  readonly VITE_CKEDITOR_LICENSE_KEY: string | undefined;
  readonly VITE_FIREBASE_API_KEY: string | undefined;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string | undefined;
  readonly VITE_FIREBASE_DATABASE_URL: string | undefined;
  readonly VITE_FIREBASE_PROJECT_ID: string | undefined;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string | undefined;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string | undefined;
  readonly VITE_FIREBASE_APP_ID: string | undefined;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string | undefined;
  readonly VITE_FIREBASE_VAPID_KEY: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
