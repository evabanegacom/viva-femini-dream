import { queryOptions } from "@tanstack/react-query";
import { createSymptomLog, getSymptomsByUser, type CreateSymptomLogPayload } from "@/lib/api/symptoms";

export const symptomLogsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["symptoms", userId],
    queryFn: () => getSymptomsByUser(userId),
    staleTime: 5 * 60 * 1000,
  });

export const createSymptomLogMutation = () => ({
  mutationFn: (payload: CreateSymptomLogPayload) => createSymptomLog(payload),
});