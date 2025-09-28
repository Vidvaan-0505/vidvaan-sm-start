import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCqiTHeKOZXgH2BuF5WZVRfZcJskF-nREo",
  authDomain: "vidvaan-sm-try.firebaseapp.com",
  projectId: "vidvaan-sm-try",
  storageBucket: "vidvaan-sm-try.firebasestorage.app",
  messagingSenderId: "225236423647",
  appId: "1:225236423647:web:0142fb7034ab911a70ea6a",
  measurementId: "G-X140B8HJXF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- Auth ---
export const auth = getAuth(app);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("email");
googleProvider.addScope("profile");

// Optionally connect to Auth Emulator (dev only)
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  } catch (error) {
  }
}

// --- Analytics ---
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
  }
}

export { analytics };
export default app;
