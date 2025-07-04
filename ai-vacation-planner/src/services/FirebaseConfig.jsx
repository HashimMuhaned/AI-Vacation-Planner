// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_GOOGLE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_GOOGLE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_GOOGLE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_GOOGLE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_GOOGLE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
