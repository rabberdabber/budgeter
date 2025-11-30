import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let app: App;

// Decode base64-encoded private key for Vercel deployment
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ? Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY, "base64").toString("utf8").replace(/\\n/g, "\n")
  : undefined;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const auth = getAuth(app);
