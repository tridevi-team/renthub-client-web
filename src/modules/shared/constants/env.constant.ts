import { z } from '@app/lib/vi-zod';

export const envSchema = z.object({
  VITE_APP_TITLE: z.string(),
  VITE_API_BASE_URL: z.string().url(),
  VITE_NODE_ENV: z.string(),
  VITE_API_PROVINCE_URL: z.string().url(),
  VITE_API_BASE_UPLOAD_URL: z.string().url(),
  VITE_CKEDITOR_LICENSE_KEY: z.string().optional(),
  VITE_FIREBASE_API_KEY: z.string().optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_FIREBASE_DATABASE_URL: z.string().optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().optional(),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  VITE_FIREBASE_VAPID_KEY: z.string().optional(),
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
  // Firebase
  const firebaseApiKey = envSchema.shape.VITE_FIREBASE_API_KEY.parse(
    import.meta.env.VITE_FIREBASE_API_KEY,
  );
  const firebaseAuthDomain = envSchema.shape.VITE_FIREBASE_AUTH_DOMAIN.parse(
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  );
  const firebaseDatabaseURL = envSchema.shape.VITE_FIREBASE_DATABASE_URL.parse(
    import.meta.env.VITE_FIREBASE_DATABASE_URL,
  );
  const firebaseProjectId = envSchema.shape.VITE_FIREBASE_PROJECT_ID.parse(
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
  );
  const firebaseStorageBucket =
    envSchema.shape.VITE_FIREBASE_STORAGE_BUCKET.parse(
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    );
  const firebaseMessagingSenderId =
    envSchema.shape.VITE_FIREBASE_MESSAGING_SENDER_ID.parse(
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    );
  const firebaseAppId = envSchema.shape.VITE_FIREBASE_APP_ID.parse(
    import.meta.env.VITE_FIREBASE_APP_ID,
  );
  const firebaseMeasurementId =
    envSchema.shape.VITE_FIREBASE_MEASUREMENT_ID.parse(
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    );
  const firebaseVapidKey = envSchema.shape.VITE_FIREBASE_VAPID_KEY.parse(
    import.meta.env.VITE_FIREBASE_VAPID_KEY,
  );

  return {
    appTitle,
    apiBaseUrl,
    apiBaseUploadUrl,
    apiProvinceUrl,
    VITE_NODE_ENV,
    ckeditorLicenseKey,
    firebaseApiKey,
    firebaseAuthDomain,
    firebaseDatabaseURL,
    firebaseProjectId,
    firebaseStorageBucket,
    firebaseMessagingSenderId,
    firebaseAppId,
    firebaseMeasurementId,
    firebaseVapidKey,
  };
})();
