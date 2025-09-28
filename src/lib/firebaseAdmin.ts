import admin from 'firebase-admin';

let firebaseAdmin: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
  if (firebaseAdmin) return firebaseAdmin;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin environment variables are missing. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  // Replace literal \n with actual newlines in private key
  const formattedKey = privateKey.replace(/\\n/g, '\n');

  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: formattedKey,
    }),
  });

  console.log('✅ Firebase Admin initialized successfully');
  return firebaseAdmin;
}
