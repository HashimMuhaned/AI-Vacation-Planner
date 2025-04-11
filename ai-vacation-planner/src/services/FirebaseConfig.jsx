// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_GOOGLE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_GOOGLE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_GOOGLE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_GOOGLE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_GOOGLE_FIREBASE_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBaRzYkmLNR9zbOI8j3RZktqWnfC9jrA4k",
//   authDomain: "ai-vacation-planner-2c7ca.firebaseapp.com",
//   projectId: "ai-vacation-planner-2c7ca",
//   storageBucket: "ai-vacation-planner-2c7ca.appspot.com",
//   messagingSenderId: "576140796898",
//   appId: "1:576140796898:web:1d41b4e4bdb8144d09cfbb",
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
