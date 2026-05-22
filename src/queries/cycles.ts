import { queryOptions } from "@tanstack/react-query";
import { getCycles } from "@/lib/api/cycles";

export const cyclesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["cycles", userId],
    queryFn: () => getCycles(userId),
    staleTime: 5 * 60 * 1000,
  });