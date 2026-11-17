import { clearTokens, getTokens, setTokens } from "@/lib/auth/token-storage";
import type { AuthTokens } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://instarchiver.net";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";

export const APP_USER_AGENT = `Instarchiver/${APP_VERSION} (+${SITE_URL})`;

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
    url: string,
    public readonly body?: unknown
  ) {
    super(`Request failed (${status}): ${url}`);
    this.name = "ApiError";
  }
}

// DRF error bodies are either {"detail": "..."} or {"field": ["...", ...]}.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback;
  const body = error.body;
  if (typeof body !== "object" || body === null) return fallback;

  if ("detail" in body && typeof body.detail === "string") return body.detail;
  for (const value of Object.values(body)) {
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return fallback;
}

export interface FetchJsonInit extends RequestInit {
  // Set to false to skip the Authorization header and the refresh-on-401 retry.
  auth?: boolean;
}

function applyServerUserAgent(headers: Headers) {
  // User-Agent is a forbidden header in browser Fetch, so only attach it on the server.
  if (typeof window === "undefined" && !headers.has("User-Agent")) {
    headers.set("User-Agent", APP_USER_AGENT);
  }
}

function withRequestHeaders(init: RequestInit, access?: string): RequestInit {
  const headers = new Headers(init.headers);
  if (access) headers.set("Authorization", `Bearer ${access}`);
  else headers.delete("Authorization");
  applyServerUserAgent(headers);
  return { ...init, headers };
}

// Shared across concurrent requests so a burst of 401s triggers one refresh.
let refreshPromise: Promise<AuthTokens | null> | null = null;

export function refreshSession(): Promise<AuthTokens | null> {
  const refresh = getTokens()?.refresh;
  if (!refresh) return Promise.resolve(null);

  refreshPromise ??= fetch(
    buildApiUrl("/authentication/refresh/"),
    withRequestHeaders({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
  )
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

const SSR_TIMEOUT_MS = 5000;

export async function fetchJson<T>(
  url: string,
  init: FetchJsonInit = {}
): Promise<T> {
  const { auth = true, ...requestInit } = init;
  const access = auth ? getTokens()?.access : undefined;
  // On the server a hung API keeps the SSR stream open until the visitor gives
  // up, so cap the wait and let the page fall back to the browser fetch.
  if (typeof window === "undefined") {
    requestInit.signal ??= AbortSignal.timeout(SSR_TIMEOUT_MS);
  }

  let res = await fetch(url, withRequestHeaders(requestInit, access));

  if (access && (await isAuthFailure(res))) {
    const tokens = await refreshSession();
    if (tokens) {
      res = await fetch(url, withRequestHeaders(requestInit, tokens.access));
    }
    // No valid session to be had: drop it and retry anonymously so public
    // endpoints keep working.
    if (!tokens || (await isAuthFailure(res))) {
      clearTokens();
      res = await fetch(url, withRequestHeaders(requestInit, undefined));
    }
  }

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => undefined);
    throw new ApiError(res.status, url, body);
  }
  return res.json() as Promise<T>;
}
