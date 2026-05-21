import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { HealthReportPage } from "@/pages/HealthReportPage";

export const Route = createFileRoute("/health-report")({
  component: () => <AppShell><HealthReportPage /></AppShell>,
  head: () => ({
    meta: [
      { title: "Health Report — VivaFemini" },
      { name: "description", content: "Comprehensive cycle summary, symptom analytics, and historical data." },
    ],
  }),
});
