import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Connect to emulators in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== "false";

  if (useEmulator) {
    try {
      // Check if not already connected
      // @ts-ignore - _settingsFrozen is internal but helps prevent double connection
      if (!firestore._settingsFrozen) {
        connectFirestoreEmulator(firestore, "localhost", 8081);
        console.log("🔥 Connected to Firestore Emulator");
      }
      // @ts-ignore - config is internal but helps prevent double connection
      if (!auth.config.emulator) {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
        console.log("🔥 Connected to Auth Emulator");
      }
    } catch (error) {
      console.log("Emulator already connected or not available");
    }
  }
}

export default app;
