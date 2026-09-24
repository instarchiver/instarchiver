import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/lib/api/stats";
import { queryKeys } from "@/lib/query-keys";

export function useStatistics() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: getStatistics,
  });
}
