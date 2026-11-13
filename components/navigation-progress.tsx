"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Must match NAVIGATION_START_EVENT in instrumentation-client.ts.
const NAVIGATION_START_EVENT = "instarchiver:navigation-start";

const INITIAL_PROGRESS = 0.15;
const MAX_TRICKLE_PROGRESS = 0.94;
const TRICKLE_STEP_FACTOR = 0.15;
const TRICKLE_INTERVAL_MS = 250;
const COMPLETE_HOLD_MS = 160;
const HIDE_DURATION_MS = 200;
const SAFETY_TIMEOUT_MS = 12_000;

type ProgressPhase = "idle" | "loading" | "completing" | "hiding";

interface NavigationProgressContextValue {
  start: () => void;
  done: () => void;
}

const NOOP = () => {};

const NavigationProgressContext =
  createContext<NavigationProgressContextValue>({
    start: NOOP,
    done: NOOP,
  });

export function useNavigationProgress(): NavigationProgressContextValue {
  return useContext(NavigationProgressContext);
}

function NavigationProgressWatcher({
  onNavigateComplete,
}: {
  onNavigateComplete: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const prevRouteKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevRouteKeyRef.current === null) {
      prevRouteKeyRef.current = routeKey;
      return;
    }
    if (prevRouteKeyRef.current === routeKey) {
      return;
    }
    prevRouteKeyRef.current = routeKey;
    onNavigateComplete();
  }, [routeKey, onNavigateComplete]);

  return null;
}

export function NavigationProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<ProgressPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [skipTransition, setSkipTransition] = useState(false);

  const phaseRef = useRef<ProgressPhase>("idle");
  const trickleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetFrameRef = useRef<number | null>(null);
  const resetFrameInnerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (trickleIntervalRef.current !== null) {
      clearInterval(trickleIntervalRef.current);
      trickleIntervalRef.current = null;
    }
    if (safetyTimeoutRef.current !== null) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    if (completeTimeoutRef.current !== null) {
      clearTimeout(completeTimeoutRef.current);
      completeTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (resetFrameRef.current !== null) {
      cancelAnimationFrame(resetFrameRef.current);
      resetFrameRef.current = null;
    }
    if (resetFrameInnerRef.current !== null) {
      cancelAnimationFrame(resetFrameInnerRef.current);
      resetFrameInnerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    phaseRef.current = "idle";
    setSkipTransition(false);
    setPhase("idle");
    setProgress(0);
  }, [clearTimers]);

  const done = useCallback(() => {
    if (phaseRef.current !== "loading") {
      return;
    }

    clearTimers();
    phaseRef.current = "completing";
    setSkipTransition(false);
    setPhase("completing");
    setProgress(1);

    completeTimeoutRef.current = setTimeout(() => {
      completeTimeoutRef.current = null;
      phaseRef.current = "hiding";
      // Keep progress at 1 while fading out so the bar does not shrink left.
      setPhase("hiding");

      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null;
        phaseRef.current = "idle";
        setPhase("idle");
        setProgress(0);
      }, HIDE_DURATION_MS);
    }, COMPLETE_HOLD_MS);
  }, [clearTimers]);

  const start = useCallback(() => {
    const wasActive = phaseRef.current !== "idle";
    clearTimers();

    phaseRef.current = "loading";
    setPhase("loading");
    setProgress(INITIAL_PROGRESS);

    // When restarting from a higher progress or fade-out, commit the reset to
    // 0.15 without animating backwards, then re-enable transitions after paint.
    if (wasActive) {
      setSkipTransition(true);
      resetFrameRef.current = requestAnimationFrame(() => {
        resetFrameRef.current = null;
        resetFrameInnerRef.current = requestAnimationFrame(() => {
          resetFrameInnerRef.current = null;
          setSkipTransition(false);
        });
      });
    } else {
      setSkipTransition(false);
    }

    trickleIntervalRef.current = setInterval(() => {
      setProgress(
        (prev) => prev + (MAX_TRICKLE_PROGRESS - prev) * TRICKLE_STEP_FACTOR
      );
    }, TRICKLE_INTERVAL_MS);

    safetyTimeoutRef.current = setTimeout(() => {
      safetyTimeoutRef.current = null;
      done();
    }, SAFETY_TIMEOUT_MS);
  }, [clearTimers, done]);

  useEffect(() => {
    const handleNavigationStart = (event: Event) => {
      const targetKey = (event as CustomEvent<{ targetKey?: string }>).detail
        ?.targetKey;
      // Skip if the route already committed before the queued microtask ran.
      if (
        targetKey &&
        `${window.location.pathname}${window.location.search}` === targetKey
      ) {
        return;
      }
      start();
    };

    const handlePopState = () => {
      done();
    };

    const handlePageHide = () => {
      reset();
    };

    window.addEventListener(NAVIGATION_START_EVENT, handleNavigationStart);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener(NAVIGATION_START_EVENT, handleNavigationStart);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pagehide", handlePageHide);
      clearTimers();
    };
  }, [clearTimers, done, reset, start]);

  const contextValue = useMemo(() => ({ start, done }), [start, done]);

  const isVisible = phase === "loading" || phase === "completing";
  const transitionClass =
    phase === "idle" || skipTransition
      ? "transition-none"
      : "transition-[transform,opacity] duration-150 ease-out-expo";

  return (
    <NavigationProgressContext.Provider value={contextValue}>
      {children}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${transitionClass} motion-reduce:transition-none`}
        style={{ transform: `scaleX(${progress})` }}
      />
      <Suspense fallback={null}>
        <NavigationProgressWatcher onNavigateComplete={done} />
      </Suspense>
    </NavigationProgressContext.Provider>
  );
}
