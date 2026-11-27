import { loginWithGoogle } from "@/lib/api/auth";
import type { AuthTokens } from "@/lib/api/types";

/** Sign in with a Google popup and exchange the Firebase ID token for backend JWTs. */
export async function signInWithGoogleForTokens(): Promise<AuthTokens> {
  // Loaded on demand so the Firebase SDK stays out of the initial bundle.
  const [{ getFirebaseAuth, createGoogleProvider }, { signInWithPopup, signOut }] =
    await Promise.all([import("@/lib/firebase"), import("firebase/auth")]);

  const firebaseAuth = getFirebaseAuth();
  const credential = await signInWithPopup(firebaseAuth, createGoogleProvider());
  try {
    const idToken = await credential.user.getIdToken();
    return await loginWithGoogle(idToken);
  } finally {
    // The backend JWT is the session from here on.
    await signOut(firebaseAuth).catch(() => {});
  }
}
