import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { HealthReportPage } from "@/pages/HealthReportPage";
import {
  healthReportQueryOptions,
  seedUserIdQueryOptions,
} from "@/queries/health-report";

export const Route = createFileRoute("/health-report")({
  loader: async ({ context }) => {
    const userId = await context.queryClient.ensureQueryData(seedUserIdQueryOptions());
    await context.queryClient.ensureQueryData(healthReportQueryOptions(userId));
  },
  component: () => <AppShell><HealthReportPage /></AppShell>,
  head: () => ({
    meta: [
      { title: "Health Report — VivaFemini" },
      { name: "description", content: "Comprehensive cycle summary, symptom analytics, and historical data." },
    ],
  }),
});
