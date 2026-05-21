import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TrackingPage } from "@/pages/TrackingPage";

export const Route = createFileRoute("/tracking")({
  component: () => <AppShell><TrackingPage /></AppShell>,
  head: () => ({
    meta: [
      { title: "Tracking — VivaFemini" },
      { name: "description", content: "Log symptoms, flow intensity, mood, and notes for your daily check-in." },
    ],
  }),
});
