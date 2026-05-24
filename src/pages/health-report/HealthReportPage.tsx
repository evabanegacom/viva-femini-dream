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
import type { ApiError, HealthReport } from "@/types/health-report-types";

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
      { label: "Cycle Length", value: `${cycleSummary.cycleLength} Days`, color: "bg-[#F36F561A] text-[#F36F56]", icon: "🌸", borderColor: '#F36F56', },
      { label: "Period Duration", value: `${cycleSummary.periodDuration} Days`, color: "bg-[#FB31791A] text-[#FB3179]", icon: "💧", borderColor: '#FB3179' },
      { label: "Estimated Next Period", value: nextPeriod, color: "bg-[#7E19DF1A] text-[#7E19DF]", icon: "📅", borderColor: '#7E19DF' },
      { label: "Ovulation Window", value: ovWindow, color: "bg-[#0D34F91A] text-[#0D34F9]", icon: "🔵", borderColor: '#0D34F9' },
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

const { cycleSummary, flowSummary, historicalCycles } = report ?? {};

const historicalRows = useMemo(() => {
  if (!historicalCycles?.length) return [];
  return historicalCycles.flatMap((cycle: any) => cycle.rows ?? []);
}, [historicalCycles]);

if (isLoading) return <HealthReportSkeleton />;
if (error) return <ErrorState error={toApiError(error)} onRetry={handleRetry} />;
if (!report) return null;

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Cycle Summary ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-bold mb-4 text-[#0F172A]">
            Cycle Summary{cycleSummary?.label ? ` — ${cycleSummary?.label}` : ""}
          </h2>

          <div className="flex flex-wrap gap-2">
            {summary.map((s) => (
              <div
                key={s.label}
                style={{ borderColor: s.borderColor }}
                className={`${s.color} border border-[${s.borderColor}] mb-2 px-3 py-1.5 rounded-full text-[10px] font-medium flex items-center gap-1.5`}
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
          <h2 className="font-bold text-[#0F172A]">Flow & Symptom Summary</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Understand your symptoms linked to sleep & activity
          </p>
          <p className="text-xs text-foreground/80 mt-3 leading-relaxed">
            {flowSummary?.narrative ||
              `Your average cycle length is ${cycleSummary?.cycleLength} days. Flow pattern remains within a typical range.`}
          </p>
          {flowSummary && flowSummary?.tips?.length > 0 && (
            <>
              <p className="text-[13px] font-semibold text-primary mt-3">Tips To Adhere To:</p>
              <ul className="text-sm text-foreground/80 space-y-1 mt-1 list-disc list-inside">
                {flowSummary?.tips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* ── Period Length Chart ───────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-bold text-sm">Period Length</h2>
          <p className="text-xs text-muted-foreground">
            Flow intensity over the cycle (0–10 scale)
          </p>
          <div className="mt-3">
            <LineChart data={flowChartData} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ↑ Higher peaks indicate stronger symptoms. Plateaus show heavier days.
          </p>
        </div>

        {/* ── Symptom Frequency ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-bold text-[#0F172A]">Symptom Frequency</h2>
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
      <h2 className="text-xs text-[#0F172A]">Historical Cycle Data</h2>
      <div className="relative inline-block">
        <button
          onClick={() => setMonthDropdownOpen((v) => !v)}
          className="text-sm font-medium text-muted-foreground mt-1 inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          {selectedMonth ?? cycleSummary?.label ?? "All months"}
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

 {historicalRows.length > 0 ? (
  <table className="w-full text-xs table-fixed">
    <thead>
      <tr className="text-left text-muted-foreground border-b border-border">
        <th className="py-2 font-medium w-[30%]">Date</th>
        <th className="py-2 font-medium w-[28%]">Top Symptom</th>
        <th className="py-2 font-medium w-[20%] text-right">Total</th>
        <th className="py-2 font-medium w-[22%] text-right">Note</th>
      </tr>
    </thead>
    <tbody>
      {historicalRows.map((row: any, i: number) => (
        <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-rose-50/50">
          <td className="py-3 pr-2">
            <div className="font-medium">{row.dateLabel}</div>
            <div className="text-[10px] text-muted-foreground">{row.timeLabel}</div>
          </td>
          <td className="py-3 pr-2 font-medium text-foreground truncate">
            {row.topSymptom || "—"}
          </td>
          <td className="py-3 text-right font-medium">{row.totalSymptomsScore ?? "—"}</td>
          <td className="py-3 text-right text-muted-foreground">
            {row.note ? (
              <span className="inline-flex items-center justify-end gap-1">
                <span className="truncate max-w-12.5">{row.note}</span>
                <FileText className="size-3 shrink-0" />
              </span>
            ) : "—"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="text-xs text-muted-foreground italic py-8 text-center">
    No historical cycle records found.
  </p>
)}
</div>
      
    </div>
  );
}