import { buildApiUrl, fetchJson, refreshSession } from "./client";
import type { AuthTokens, AuthUser } from "./types";

export function loginWithGoogle(firebaseIdToken: string) {
  return fetchJson<AuthTokens>(buildApiUrl("/authentication/login-with-google/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: firebaseIdToken }),
    auth: false,
  });
}

export const refreshTokens = refreshSession;

export function validateToken() {
  return fetchJson<{ detail: string }>(
    buildApiUrl("/authentication/validate/"),
    { method: "POST" }
  );
}

export function getMe() {
  return fetchJson<AuthUser>(buildApiUrl("/authentication/me/"));
}
