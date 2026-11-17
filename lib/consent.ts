export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() ||
  "ca-pub-3865845660755241";

export function getAdsensePublisherId(): string {
  const explicit = process.env.ADSENSE_PUBLISHER_ID?.trim();
  if (explicit) return explicit;
  if (!ADSENSE_CLIENT_ID) return "";
  return ADSENSE_CLIENT_ID.startsWith("ca-")
    ? ADSENSE_CLIENT_ID.slice(3)
    : ADSENSE_CLIENT_ID;
}

export interface ConsentPreferences {
  analytics: boolean;
  advertising: boolean;
}

export const DEFAULT_CONSENT: ConsentPreferences = {
  analytics: false,
  advertising: false,
};

export const CONSENT_STORAGE_KEY = "instarchiver.consent";
const CONSENT_CHANGE_EVENT = "instarchiver:consent-change";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function parseConsentSnapshot(
  raw: string | null
): ConsentPreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (
      typeof parsed.analytics === "boolean" &&
      typeof parsed.advertising === "boolean"
    ) {
      return {
        analytics: parsed.analytics,
        advertising: parsed.advertising,
      };
    }
  } catch {
    // Ignore storage or JSON errors and treat consent as undecided.
  }
  return null;
}

export function getConsentSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getConsentServerSnapshot(): string | null {
  return null;
}

export function subscribeConsent(callback: () => void): () => void {
  function onStorage(e: StorageEvent) {
    if (e.key === CONSENT_STORAGE_KEY || e.key === null) callback();
  }
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function readStoredConsent(): ConsentPreferences | null {
  return parseConsentSnapshot(getConsentSnapshot());
}

export function writeStoredConsent(prefs: ConsentPreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage may be unavailable in private browsing or restricted contexts.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function updateGtagConsent(prefs: ConsentPreferences): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("consent", "update", {
    ad_storage: prefs.advertising ? "granted" : "denied",
    ad_user_data: prefs.advertising ? "granted" : "denied",
    ad_personalization: prefs.advertising ? "granted" : "denied",
    analytics_storage: prefs.analytics ? "granted" : "denied",
  });
}
