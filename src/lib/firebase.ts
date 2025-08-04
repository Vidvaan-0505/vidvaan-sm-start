import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1QY-OojzBbqwCi_WRIgv4LvJsNImjgMc",
  authDomain: "vidvaan-attempt-2.firebaseapp.com",
  projectId: "vidvaan-attempt-2",
  storageBucket: "vidvaan-attempt-2.firebasestorage.app",
  messagingSenderId: "148174256346",
  appId: "1:148174256346:web:26b47735682aa0a1aa0de3",
  measurementId: "G-L05BZGSEN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Connect to emulators in development (temporarily disabled)
// Uncomment this section when emulators are running
/*
if (process.env.NODE_ENV === 'development') {
  // Check if we're running in the browser and emulators are available
  if (typeof window !== 'undefined') {
    // Connect to Auth emulator
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    } catch (error) {
      console.log('Auth emulator already connected or not available');
    }

    // Connect to Firestore emulator
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      console.log('Firestore emulator already connected or not available');
    }
  }
}
*/

// Initialize Analytics only on client side and production
let analytics = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app; 