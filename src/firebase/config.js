import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeySmartCarpool12345678",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartcarpool-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartcarpool-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartcarpool-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://smartcarpool-demo-default-rtdb.firebaseio.com"
};

// Check if valid environment variables are present
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY !== "your_firebase_api_key_here"
);

let app;
let auth;
let db;
let rtdb;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);
} catch (error) {
  console.warn("Firebase initialization warning (using local fallback store if offline/unconfigured):", error);
}

export const googleProvider = new GoogleAuthProvider();
export { app, auth, db, rtdb };
