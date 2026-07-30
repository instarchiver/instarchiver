import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useSearchParamState(key: string, defaultValue = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next && next !== defaultValue) params.set(key, next);
      else params.delete(key);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [defaultValue, key, pathname, router, searchParams]
  );

  return { value, setValue };
}
