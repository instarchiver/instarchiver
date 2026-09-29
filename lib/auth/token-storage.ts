import type { AuthTokens } from "@/lib/api/types";

const STORAGE_KEY = "instarchiver.auth";
const CHANGE_EVENT = "instarchiver:auth-change";

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getTokens(): AuthTokens | null {
  const raw = readRaw();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AuthTokens>;
    if (typeof parsed.access === "string" && typeof parsed.refresh === "string") {
      return { access: parsed.access, refresh: parsed.refresh };
    }
  } catch {
    // corrupt value, treat as signed out
  }
  return null;
}

export function setTokens(tokens: AuthTokens) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // storage unavailable (private mode, blocked site data)
  }
  notify();
}

export function clearTokens() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  notify();
}

// For useSyncExternalStore: the raw string is stable between reads, so it
// works as a snapshot without extra memoization.
export function subscribeTokens(callback: () => void) {
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  }
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getTokensSnapshot(): string | null {
  return readRaw();
}

export function getTokensServerSnapshot(): string | null {
  return null;
}
