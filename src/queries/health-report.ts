import { queryOptions } from "@tanstack/react-query";
import { getHealthReport, seedAndGetUserId } from "@/lib/api/health-report";
import { ApiError } from "@/types/health-report-types";

// queries/health-report.ts
export const seedUserIdQueryOptions = () =>
  queryOptions<string, ApiError>({  // ← generics belong here
    queryKey: ["seed-user-id"],
    queryFn: seedAndGetUserId,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

export const healthReportQueryOptions = (userId: string, month?: string) =>
  queryOptions({
    queryKey: ["health-report", userId, month],
    queryFn: () => getHealthReport(userId, month),
    staleTime: 5 * 60 * 1000,
  });
