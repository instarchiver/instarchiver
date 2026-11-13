const NAVIGATION_START_EVENT = "instarchiver:navigation-start";

export interface NavigationStartDetail {
  targetKey: string;
}

export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse"
) {
  if (navigationType !== "push" || typeof window === "undefined") {
    return;
  }

  let target: URL;
  try {
    target = new URL(url, window.location.href);
  } catch {
    return;
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return;
  }
  if (target.origin !== window.location.origin) {
    return;
  }
  if (
    target.pathname === window.location.pathname &&
    target.search === window.location.search
  ) {
    return;
  }

  const targetKey = `${target.pathname}${target.search}`;

  // Next.js invokes this hook inside React.startTransition; deferring one
  // microtask prevents React from batching the bar's initial render into the
  // suspended route transition.
  queueMicrotask(() => {
    window.dispatchEvent(
      new CustomEvent<NavigationStartDetail>(NAVIGATION_START_EVENT, {
        detail: { targetKey },
      })
    );
  });
}
