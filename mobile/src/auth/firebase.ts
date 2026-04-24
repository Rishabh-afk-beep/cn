import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCamGQdj3V2bJqbYm90sFSJfEMrb82Bvps",
  authDomain: "urbanpg-a7198.firebaseapp.com",
  projectId: "urbanpg-a7198",
  storageBucket: "urbanpg-a7198.firebasestorage.app",
  messagingSenderId: "834473040578",
  appId: "1:834473040578:web:7ef2bccc50e10f86ca2ff9",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: ReturnType<typeof initializeAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  // Already initialized
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
}

export { app, auth };
