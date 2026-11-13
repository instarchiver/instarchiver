import type { VirtualItem } from "@tanstack/react-virtual";

export interface SavedGridScrollState {
  scrollY: number;
  width: number;
  columnCount: number;
  totalHeight: number;
  snapshot: VirtualItem[];
  urlKey: string;
}

interface PopStateMarker {
  urlKey: string;
  pathname: string;
  seq: number;
}

const MAX_MEMORY_ENTRIES = 30;
const STORAGE_PREFIX = "instarchiver:grid-scroll:";

const memoryStates = new Map<string, SavedGridScrollState>();
const consumedRestoreKeys = new Set<string>();

let listenersAttached = false;
let popSeq = 0;
let activePop: PopStateMarker | null = null;
let backForwardReloadChecked = false;

export function getCurrentUrlKey(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}`;
}

function setMemoryEntry(key: string, value: SavedGridScrollState) {
  if (memoryStates.has(key)) {
    memoryStates.delete(key);
  }
  memoryStates.set(key, value);
  if (memoryStates.size > MAX_MEMORY_ENTRIES) {
    const oldestKey = memoryStates.keys().next().value;
    if (oldestKey !== undefined) {
      memoryStates.delete(oldestKey);
    }
  }
}

function readStorageEntry(key: string): SavedGridScrollState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedGridScrollState>;
    if (
      typeof parsed.scrollY !== "number" ||
      typeof parsed.width !== "number" ||
      typeof parsed.columnCount !== "number" ||
      typeof parsed.totalHeight !== "number" ||
      !Array.isArray(parsed.snapshot)
    ) {
      return null;
    }
    return {
      scrollY: parsed.scrollY,
      width: parsed.width,
      columnCount: parsed.columnCount,
      totalHeight: parsed.totalHeight,
      snapshot: parsed.snapshot,
      urlKey: typeof parsed.urlKey === "string" ? parsed.urlKey : key,
    };
  } catch {
    return null;
  }
}

function writeStorageEntry(key: string, value: SavedGridScrollState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(value)
    );
  } catch {
    // Ignore storage quota / private mode errors; memory map still works.
  }
}

function removeStorageEntry(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore storage access errors.
  }
}

function seedBackForwardOnColdLoad() {
  if (backForwardReloadChecked || typeof window === "undefined") return;
  backForwardReloadChecked = true;
  try {
    const navEntries = performance.getEntriesByType("navigation") as
      | PerformanceNavigationTiming[]
      | undefined;
    if (navEntries?.[0]?.type === "back_forward") {
      activePop = {
        urlKey: getCurrentUrlKey(),
        pathname: window.location.pathname,
        seq: ++popSeq,
      };
      consumedRestoreKeys.clear();
    }
  } catch {
    // Ignore environments without PerformanceNavigationTiming.
  }
}

export function ensureNavigationListeners() {
  if (typeof window === "undefined") return;
  seedBackForwardOnColdLoad();
  if (listenersAttached) return;
  listenersAttached = true;

  window.addEventListener(
    "popstate",
    () => {
      activePop = {
        urlKey: getCurrentUrlKey(),
        pathname: window.location.pathname,
        seq: ++popSeq,
      };
      consumedRestoreKeys.clear();
    },
    { capture: true }
  );
}

if (typeof window !== "undefined") {
  ensureNavigationListeners();
}

/**
 * Returns true if the current pathname matches an active popstate navigation,
 * preserving the marker for child InfiniteGrid instances mounting on the route.
 */
export function consumePopNavigation(pathname: string): boolean {
  ensureNavigationListeners();
  if (activePop && activePop.pathname === pathname) {
    return true;
  }
  activePop = null;
  consumedRestoreKeys.clear();
  return false;
}

export function clearGridScrollStateForUrl(urlKey: string) {
  for (const [key, entry] of memoryStates.entries()) {
    if (key === urlKey || entry.urlKey === urlKey) {
      memoryStates.delete(key);
      removeStorageEntry(key);
    }
  }
  removeStorageEntry(urlKey);
}

export function saveGridScrollState(key: string, state: SavedGridScrollState) {
  setMemoryEntry(key, state);
  writeStorageEntry(key, state);
}

export function getSavedGridScrollState(key: string): SavedGridScrollState | null {
  const fromMemory = memoryStates.get(key);
  if (fromMemory) return fromMemory;
  const fromStorage = readStorageEntry(key);
  if (fromStorage) {
    setMemoryEntry(key, fromStorage);
  }
  return fromStorage;
}

/**
 * Peeks whether a scroll state exists AND the current page entry came from
 * browser back/forward history (`popstate` or `back_forward` reload).
 */
export function peekPendingGridRestore(key: string): SavedGridScrollState | null {
  if (typeof window === "undefined") return null;
  ensureNavigationListeners();
  if (!activePop) return null;
  if (activePop.urlKey !== getCurrentUrlKey()) {
    activePop = null;
    consumedRestoreKeys.clear();
    return null;
  }
  const restoreToken = `${activePop.seq}:${key}`;
  if (consumedRestoreKeys.has(restoreToken)) return null;
  return getSavedGridScrollState(key);
}

export function markGridRestoreConsumed(key: string) {
  if (!activePop) return;
  consumedRestoreKeys.add(`${activePop.seq}:${key}`);
}
