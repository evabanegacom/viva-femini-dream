import type {
  ApiResponse,
  HealthReport,
  ApiError,
} from "@/types/health-report-types";
import { apiFetch } from "@/lib/api/client";

export async function seedAndGetUserId(): Promise<string> {
  const json = await apiFetch<ApiResponse>("/seed", { method: "POST" });
  const userId = json?.data?.userId;

  if (!userId) {
    throw { message: "Seed response missing userId", status: 500 } as ApiError;
  }

  return userId;
}

export async function getHealthReport(userId: string, month?: string): Promise<HealthReport> {
  const params = new URLSearchParams({ userId });
  if (month) params.set("month", month);

  const json = await apiFetch<ApiResponse>(`/health-report?${params.toString()}`);

  if (!json.success) {
    throw { message: "API returned success: false", status: 500 } as ApiError;
  }

  const d = json.data;
  return {
    cycleSummary: d.cycleSummary,
    flowSummary: {
      averageCycleLength: d.flowAndSymptomsSummary.averageCycleLength,
      narrative: d.flowAndSymptomsSummary.narrative,
      tips: d.flowAndSymptomsSummary.tips,
    },
    donuts: d.symptomFrequency.donuts,
    historicalCycles: d.historicalCycleData,
    flowChartData: d.periodLengthChart,
  };
}
