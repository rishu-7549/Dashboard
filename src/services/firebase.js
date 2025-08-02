import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// // Validate that all required environment variables are present
// const requiredEnvVars = [
//   'VITE_FIREBASE_API_KEY',
//   'VITE_FIREBASE_AUTH_DOMAIN', 
//   'VITE_FIREBASE_PROJECT_ID',
//   'VITE_FIREBASE_STORAGE_BUCKET',
//   'VITE_FIREBASE_MESSAGING_SENDER_ID',
//   'VITE_FIREBASE_APP_ID'
// ];

// const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

// if (missingVars.length > 0) {
//   console.error('Missing required Firebase environment variables:', missingVars);
//   console.error('Please check your .env file and ensure all Firebase configuration variables are set.');
// }

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Authentication functions
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
