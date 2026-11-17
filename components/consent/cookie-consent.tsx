"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  DEFAULT_CONSENT,
  getConsentServerSnapshot,
  getConsentSnapshot,
  parseConsentSnapshot,
  subscribeConsent,
  updateGtagConsent,
  writeStoredConsent,
  type ConsentPreferences,
} from "@/lib/consent";

interface CookieConsentContextValue {
  consent: ConsentPreferences;
  hasDecided: boolean;
  openPreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: DEFAULT_CONSENT,
  hasDecided: false,
  openPreferences: () => {},
});

const emptySubscribe = () => () => {};

export function useCookieConsent(): CookieConsentContextValue {
  return useContext(CookieConsentContext);
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const rawSnapshot = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );
  const storedConsent = useMemo(
    () => parseConsentSnapshot(rawSnapshot),
    [rawSnapshot]
  );

  const consent = storedConsent ?? DEFAULT_CONSENT;
  const hasDecided = storedConsent !== null;

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [draft, setDraft] = useState<ConsentPreferences>(DEFAULT_CONSENT);

  useEffect(() => {
    if (storedConsent) {
      updateGtagConsent(storedConsent);
    }
  }, [storedConsent]);

  const savePreferences = useCallback((next: ConsentPreferences) => {
    setDraft(next);
    setIsPreferencesOpen(false);
    setShowCustomize(false);
    writeStoredConsent(next);
    updateGtagConsent(next);
  }, []);

  const openPreferences = useCallback(() => {
    setDraft(consent);
    setShowCustomize(true);
    setIsPreferencesOpen(true);
  }, [consent]);

  const value = useMemo(
    () => ({ consent, hasDecided, openPreferences }),
    [consent, hasDecided, openPreferences]
  );

  const isBannerOpen = isHydrated && (!hasDecided || isPreferencesOpen);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {isBannerOpen && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-30 mx-auto max-w-2xl rounded-xl border border-border bg-card p-4 shadow-md sm:p-5"
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Cookie preferences
              </p>
              <p className="text-sm leading-5 text-muted-foreground">
                Instarchiver uses essential storage for your theme and session,
                plus optional cookies for Google Analytics and Google AdSense.
                See our{" "}
                <Link
                  href="/privacy"
                  className="rounded-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {showCustomize && (
              <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3">
                <label className="flex cursor-pointer items-start justify-between gap-3 py-1">
                  <span className="text-sm">
                    <span className="block font-medium text-foreground">
                      Analytics
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Helps measure aggregate page visits via Google Analytics.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={draft.analytics}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                  />
                </label>

                <label className="flex cursor-pointer items-start justify-between gap-3 border-t border-border py-1 pt-2">
                  <span className="text-sm">
                    <span className="block font-medium text-foreground">
                      Advertising
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Allows Google AdSense to serve and personalize ads.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={draft.advertising}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        advertising: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                  />
                </label>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              {!showCustomize ? (
                <button
                  type="button"
                  onClick={() => {
                    setDraft(consent);
                    setShowCustomize(true);
                  }}
                  className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mr-auto"
                >
                  Customize
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => savePreferences(draft)}
                  className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mr-auto"
                >
                  Save preferences
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  savePreferences({ analytics: false, advertising: false })
                }
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Essential only
              </button>
              <button
                type="button"
                onClick={() =>
                  savePreferences({ analytics: true, advertising: true })
                }
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </CookieConsentContext.Provider>
  );
}

export function CookiePreferencesButton({ className }: { className?: string }) {
  const { openPreferences } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className={
        className ??
        "cursor-pointer rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      }
    >
      Cookie preferences
    </button>
  );
}
