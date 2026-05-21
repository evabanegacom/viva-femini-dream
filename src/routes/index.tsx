import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  component: () => <AppShell><HomePage /></AppShell>,
  head: () => ({
    meta: [
      { title: "Home — VivaFemini" },
      { name: "description", content: "Your cycle dashboard, daily check-ins, and personalized wellness tips." },
    ],
  }),
});
