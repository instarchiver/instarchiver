import { useSyncExternalStore } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, loginWithGoogle } from "@/lib/api/auth";
import {
  clearTokens,
  getTokensServerSnapshot,
  getTokensSnapshot,
  setTokens,
  subscribeTokens,
} from "@/lib/auth/token-storage";
import { queryKeys } from "@/lib/query-keys";

export function useHasSession() {
  const raw = useSyncExternalStore(
    subscribeTokens,
    getTokensSnapshot,
    getTokensServerSnapshot
  );
  return raw !== null;
}

export function useMe() {
  const hasSession = useHasSession();
  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    enabled: hasSession,
    retry: false,
    staleTime: 5 * 60_000,
  });

  return {
    ...query,
    user: hasSession ? query.data : undefined,
    isLoadingUser: hasSession && query.isPending,
  };
}

const CANCELLED_POPUP_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
]);

// Closing the Google popup is a user choice, not a failure worth reporting.
export function isCancelledPopup(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    CANCELLED_POPUP_CODES.has(String(error.code))
  );
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
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
    },
    onSuccess: (tokens) => {
      setTokens(tokens);
      return queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearTokens();
    queryClient.removeQueries({ queryKey: queryKeys.auth.me });
  };
}
