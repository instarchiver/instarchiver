import { clearTokens, getTokens, setTokens } from "@/lib/auth/token-storage";
import type { AuthTokens } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function buildApiUrl(
  path: string,
  params?: Record<string, string | undefined>
): string {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    url: string
  ) {
    super(`Request failed (${status}): ${url}`);
    this.name = "ApiError";
  }
}

export interface FetchJsonInit extends RequestInit {
  // Set to false to skip the Authorization header and the refresh-on-401 retry.
  auth?: boolean;
}

function withAuthHeader(init: RequestInit, access: string | undefined) {
  const headers = new Headers(init.headers);
  if (access) headers.set("Authorization", `Bearer ${access}`);
  else headers.delete("Authorization");
  return { ...init, headers };
}

// Shared across concurrent requests so a burst of 401s triggers one refresh.
let refreshPromise: Promise<AuthTokens | null> | null = null;

export function refreshSession(): Promise<AuthTokens | null> {
  const refresh = getTokens()?.refresh;
  if (!refresh) return Promise.resolve(null);

  refreshPromise ??= fetch(buildApiUrl("/authentication/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  })
    .then(async (res) => {
      if (!res.ok) throw new ApiError(res.status, res.url);
      const tokens = (await res.json()) as AuthTokens;
      setTokens(tokens);
      return tokens;
    })
    .catch(() => {
      clearTokens();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

const AUTH_ERROR_CODES = new Set([
  "token_not_valid",
  "authentication_failed",
  "not_authenticated",
]);

// DRF answers a bad token with 403 instead of 401 because SessionAuthentication
// is listed first, so a 403 counts only when its body carries an auth error code.
async function isAuthFailure(res: Response) {
  if (res.status === 401) return true;
  if (res.status !== 403) return false;
  try {
    const body = (await res.clone().json()) as { code?: unknown };
    return typeof body.code === "string" && AUTH_ERROR_CODES.has(body.code);
  } catch {
    return false;
  }
}

export async function fetchJson<T>(
  url: string,
  init: FetchJsonInit = {}
): Promise<T> {
  const { auth = true, ...requestInit } = init;
  const access = auth ? getTokens()?.access : undefined;

  let res = await fetch(url, withAuthHeader(requestInit, access));

  if (access && (await isAuthFailure(res))) {
    const tokens = await refreshSession();
    if (tokens) {
      res = await fetch(url, withAuthHeader(requestInit, tokens.access));
    }
    // No valid session to be had: drop it and retry anonymously so public
    // endpoints keep working.
    if (!tokens || (await isAuthFailure(res))) {
      clearTokens();
      res = await fetch(url, withAuthHeader(requestInit, undefined));
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, url);
  }
  return res.json() as Promise<T>;
}
