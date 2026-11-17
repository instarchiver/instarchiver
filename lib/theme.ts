export const THEME_STORAGE_KEY = "theme";

function applyDocumentTheme(storageKey: string): void {
  try {
    const root = document.documentElement;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(storageKey);
    } catch {
      // Storage may be unavailable; fall back to the system color scheme.
    }

    const resolved =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  } catch {
    // Ignore errors when document or matchMedia is unavailable.
  }
}

/**
 * Synchronous pre-hydration script run in <head> to apply the theme class and
 * color-scheme before first paint.
 */
export const THEME_INIT_SCRIPT = `(${applyDocumentTheme.toString()})(${JSON.stringify(THEME_STORAGE_KEY)})`;

/**
 * Re-applies the active theme class and color-scheme before paint (used to
 * recover after React 19 Strict Mode dev remounts reset <html> attributes).
 */
export function syncDocumentTheme(): void {
  if (typeof document === "undefined") return;
  applyDocumentTheme(THEME_STORAGE_KEY);
}
