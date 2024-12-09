import { env } from '@shared/constants/env.constant';
import { getUserAppStore } from '@shared/utils/helper.util';
import { getFingerprint } from '@thumbmarkjs/thumbmarkjs';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId: env.firebaseAppId,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.error('Notification permission not granted.');
    return null;
  }
  const userId = getUserAppStore()?.id;
  if (!userId) return null;
  const deviceId = await getFingerprint();
  try {
    const token = await getToken(messaging, {
      vapidKey: env.firebaseVapidKey,
    });
    const tokenRef = doc(db, 'users', userId, 'devices', deviceId);
    await setDoc(tokenRef, { FCM: token }, { merge: true });
    return token;
  } catch (error) {
    console.error('Error retrieving FCM token:', error);
  }
};
