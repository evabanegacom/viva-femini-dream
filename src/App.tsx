import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { GlobalLoader } from "@/components/global-loader";

const HomePage = React.lazy(() => import("@/pages/home-page/HomePage").then(m => ({ default: m.HomePage })));
const TrackingPage = React.lazy(() => import("@/pages/tracking-page/TrackingPage").then(m => ({ default: m.TrackingPage })));
const HealthReportPage = React.lazy(() => import("@/pages/health-report/HealthReportPage").then(m => ({ default: m.HealthReportPage })));

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/health-report" element={<HealthReportPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
