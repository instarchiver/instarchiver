import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useDebouncedSearchParam(key: string, delay = 400) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const committed = searchParams.get(key) ?? "";

  const [value, setLocalValue] = useState(committed);
  const [prevCommitted, setPrevCommitted] = useState(committed);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (committed !== prevCommitted) {
    setPrevCommitted(committed);
    setLocalValue(committed);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const setValue = useCallback(
    (next: string) => {
      setLocalValue(next);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = next.trim();
        if (trimmed) params.set(key, trimmed);
        else params.delete(key);

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }, delay);
    },
    [delay, key, pathname, router, searchParams]
  );

  return { value, debouncedValue: committed, setValue };
}
