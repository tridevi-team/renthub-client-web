// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        console.error("Notification permission not granted.");
        return null;
    }
    try {
        const token = await getToken(messaging, {
            vapidKey: "...",
        });
        console.log("FCM Token:", token);
        const tokenRef = doc(db, "users", "<userId>", "devices", Math.random().toString(36).substring(7));
        await setDoc(tokenRef, { FCM: token }, {merge: true});
        return token;
    } catch (error) {
        console.error("Error retrieving FCM token:", error);
    }
};