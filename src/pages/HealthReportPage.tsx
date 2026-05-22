// HealthReportPage.tsx
import {
  Donut,
  DONUT_COLORS,
  ErrorState,
  formatDate,
  HealthReportSkeleton,
} from "@/components/shared";
import LineChart from "@/components/line-chart";
import { ChevronDown, Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { seedUserIdQueryOptions, healthReportQueryOptions } from "@/queries/health-report";
import { toApiError } from "@/lib/api/client";
import type { ApiError } from "@/types/health-report-types";

// ─── Main component ───────────────────────────────────────────────────────────

export function HealthReportPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  // Step 1: Resolve userId once — never refetches unless manually invalidated
  const {
    data: userId,
    isLoading: isSeeding,
    error: seedError,
    refetch: refetchSeed,
  } = useQuery<string, ApiError>(seedUserIdQueryOptions());

  // Step 2: Fetch report — re-runs automatically when userId or selectedMonth changes
  const {
    data: report,
    isLoading: isLoadingReport,
    error: reportError,
    refetch: refetchReport,
  } = useQuery({
    ...healthReportQueryOptions(userId ?? "", selectedMonth),
    enabled: !!userId,
  });

  // ── Derived display values ─────────────────────────────────────────────────

  const summary = useMemo(() => {
    if (!report) return [];
    const { cycleSummary } = report;
    const nextPeriod = cycleSummary.estimatedNextPeriod
      ? formatDate(cycleSummary.estimatedNextPeriod)
      : "—";
    const ovWindow = cycleSummary.ovulationWindow ?? "—";
    return [
      { label: "Cycle Length", value: `${cycleSummary.cycleLength} Days`, color: "bg-rose-50 text-rose-600", icon: "🌸" },
      { label: "Period Duration", value: `${cycleSummary.periodDuration} Days`, color: "bg-amber-50 text-amber-600", icon: "💧" },
      { label: "Estimated Next Period", value: nextPeriod, color: "bg-purple-50 text-purple-600", icon: "📅" },
      { label: "Ovulation Window", value: ovWindow, color: "bg-blue-50 text-blue-600", icon: "🔵" },
    ];
  }, [report]);

  const flowChartData = useMemo(() => report?.flowChartData ?? [], [report]);

  const donutItems = useMemo(() => {
    if (!report?.donuts?.length) return [];
    return report.donuts.slice(0, 6).map((item, i) => ({
      value: Math.round(item.percentage),
      label: item.label,
      color: item.color || DONUT_COLORS[i % DONUT_COLORS.length],
    }));
  }, [report]);

  // ── Loading / error states ─────────────────────────────────────────────────

  const isLoading = isSeeding || isLoadingReport;
  const error = seedError || reportError;

  function handleRetry() {
    if (seedError) refetchSeed();
    else refetchReport();
  }

  console.log({flowChartData});

  if (isLoading) return <HealthReportSkeleton />;
  if (error) return <ErrorState error={toApiError(error)} onRetry={handleRetry} />;
  if (!report) return null;

  const { cycleSummary, flowSummary, historicalCycles } = report;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Cycle Summary ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold mb-4">
            Cycle Summary{cycleSummary.label ? ` — ${cycleSummary.label}` : ""}
          </h2>
          <div className="flex flex-wrap gap-2">
            {summary.map((s) => (
              <div
                key={s.label}
                className={`${s.color} px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5`}
              >
                <span>{s.icon}</span>
                <span className="opacity-70">{s.label}:</span>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Flow & Symptom Summary ────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold">Flow & Symptom Summary</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Understand your symptoms linked to sleep & activity
          </p>
          <p className="text-xs text-foreground/80 mt-3 leading-relaxed">
            {flowSummary?.narrative ||
              `Your average cycle length is ${cycleSummary.cycleLength} days. Flow pattern remains within a typical range.`}
          </p>
          {flowSummary?.tips?.length > 0 && (
            <>
              <p className="text-xs font-semibold text-primary mt-3">Tips To Adhere To:</p>
              <ul className="text-xs text-foreground/80 space-y-1 mt-1 list-disc list-inside">
                {flowSummary.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* ── Period Length Chart ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold">Period Length</h2>
          <p className="text-xs text-muted-foreground">
            Flow intensity over the cycle (0–10 scale)
          </p>
          <div className="mt-3">
            <LineChart data={flowChartData} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            ↑ Higher peaks indicate stronger symptoms. Plateaus show heavier days.
          </p>
        </div>

        {/* ── Symptom Frequency ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold">Symptom Frequency</h2>
          <p className="text-xs text-muted-foreground">
            Study your body system & understand your wellbeing
          </p>
          {donutItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {donutItems.map((d, i) => (
                <Donut key={i} value={d.value} label={d.label} color={d.color} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-4 italic">No symptom data logged yet.</p>
          )}
        </div>
      </div>

      {/* ── Historical Cycle Data ──────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold">Historical Cycle Data</h2>
            <div className="relative inline-block">
              <button
                onClick={() => setMonthDropdownOpen((v) => !v)}
                className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {selectedMonth ?? cycleSummary.label ?? "All months"}
                <ChevronDown className={`size-3 transition-transform ${monthDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {monthDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-border/60 z-10 min-w-[140px]">
                  {([undefined, "Oct 2025", "Sep 2025", "Aug 2025"] as const).map((m, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedMonth(m); setMonthDropdownOpen(false); }}
                      className="block w-full text-left text-xs px-3 py-2 hover:bg-rose-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      {m ?? "All months"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity">
            <Download className="size-3.5" /> Download PDF
          </button>
        </div>

        {historicalCycles?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Top Symptom</th>
                  <th className="py-2 font-medium text-right">Total Symptoms</th>
                  <th className="py-2 font-medium text-right">Note</th>
                </tr>
              </thead>
              <tbody>
                {historicalCycles.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-rose-50/50">
                    <td className="py-3">
                      <div className="font-medium">{formatDate(row.date)}</div>
                    </td>
                    <td className="py-3 font-medium text-foreground">{row.topSymptom || "—"}</td>
                    <td className="py-3 text-right font-medium">{row.totalSymptoms ?? "—"}</td>
                    <td className="py-3 text-right text-muted-foreground">
                      {row.note ? (
                        <span className="inline-flex items-center gap-1">
                          {row.note}
                          <FileText className="size-3" />
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-8 text-center">
            No historical cycle records found.
          </p>
        )}
      </div>
    </div>
  );
}