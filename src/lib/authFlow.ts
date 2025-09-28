// src/lib/authFlow.ts
import {
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    User,
    GoogleAuthProvider,
  } from "firebase/auth";
  import { auth } from "./firebase";
  
  export async function signupWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      return userCred.user;
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        const methods = await fetchSignInMethodsForEmail(auth, email);
  
        if (methods.includes(GoogleAuthProvider.PROVIDER_ID)) {
          throw new Error("ACCOUNT_EXISTS_GOOGLE");
        }
        if (methods.includes("password")) {
          throw new Error("ACCOUNT_EXISTS_EMAIL");
        }
        throw new Error("ACCOUNT_EXISTS_OTHER"); // e.g. GitHub, Facebook, etc.
      }
      throw err;
    }
  }
  