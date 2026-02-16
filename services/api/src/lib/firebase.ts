import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db: admin.firestore.Firestore = admin.firestore();
export const auth: admin.auth.Auth = admin.auth();
export const messaging: admin.messaging.Messaging = admin.messaging();
