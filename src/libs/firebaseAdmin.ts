import admin from 'firebase-admin';

// Evitar reinicialización en desarrollo con Next.js
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)),
  });
}

export default admin;
