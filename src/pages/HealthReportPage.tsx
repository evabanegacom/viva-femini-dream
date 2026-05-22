import LineChart from "@/components/line-chart";
import { Download, FileText, ChevronDown, RefreshCw, AlertCircle } from "lucide-react";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";

const BASE_URL = "http://localhost:3000/api/v1";

/** Seeds the DB and returns the demo userId. Safe to call repeatedly. */
async function seedAndGetUserId(): Promise<string> {
  const res = await fetch(`${BASE_URL}/seed`, { method: "POST" });
  if (!res.ok) throw { message: `Seed failed: ${res.status} ${res.statusText}`, status: res.status };
  const json = await res.json();
  const uid = json?.data?.userId;
  if (!uid) throw { message: "Seed response missing userId", status: 500 };
  return uid as string;
}

async function fetchHealthReport(userId: string, month?: string): Promise<HealthReport> {
  const params = new URLSearchParams({ userId });
  if (month) params.set("month", month);
  const res = await fetch(`${BASE_URL}/health-report?${params}`);
  if (!res.ok) throw { message: `Server error: ${res.status} ${res.statusText}`, status: res.status };
  const json: ApiResponse = await res.json();
  if (!json.success) throw { message: "API returned success: false", status: 500 };
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

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-rose-50 via-pink-100/60 to-rose-50 bg-[length:200%_100%] rounded-xl ${className}`}
      style={{ animation: "skeleton-shimmer 1.6s ease-in-out infinite" }}
    />
  );
}

// ─── Chart Components ─────────────────────────────────────────────────────────

function Donut({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="oklch(0.94 0.01 320)" strokeWidth="7" />
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">{value}%</div>
      </div>
      <p className="text-[11px] text-foreground/70 text-center">
        <span className="inline-block size-1.5 rounded-full mr-1" style={{ background: color }} />
        {label}
      </p>
    </div>
  );
}

const DONUT_COLORS = [
  "oklch(0.65 0.22 0)",
  "oklch(0.6 0.22 320)",
  "oklch(0.7 0.18 140)",
  "oklch(0.7 0.22 30)",
  "oklch(0.7 0.22 60)",
  "oklch(0.6 0.22 270)",
];

// ─── Loading skeleton for the full page ───────────────────────────────────────

function HealthReportSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cycle Summary skeleton */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-3">
          <Skeleton className="h-5 w-48" />
          <div className="flex flex-wrap gap-2">
            {[120, 110, 130, 145].map((w, i) => (
              <Skeleton key={i} className="h-7 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
        {/* Flow & Symptom summary skeleton */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-4 w-32 mt-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        {/* Line chart skeleton */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-44 w-full mt-2" />
        </div>
        {/* Symptom frequency skeleton */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-3">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-60" />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="size-[72px] rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Table skeleton */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="space-y-3 mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center border-b border-border/40 pb-3">
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2.5 w-14" />
              </div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-5 animate-in fade-in duration-300">
      <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center">
        <AlertCircle className="size-8 text-rose-400" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Couldn't load your health report</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {error.status === 404
            ? "No health data found for this account. Start logging your cycle to generate a report."
            : error.message || "Something went wrong. Please try again."}
        </p>
      </div>
      {error.status !== 404 && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
        >
          <RefreshCw className="size-4" /> Try again
        </button>
      )}
    </div>
  );
}

// ─── Derived display helpers ──────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function deriveOvulationWindow(startDate: string, cycleLength: number): string {
  try {
    const start = new Date(startDate);
    const ovStart = new Date(start);
    ovStart.setDate(start.getDate() + cycleLength - 16);
    const ovEnd = new Date(start);
    ovEnd.setDate(start.getDate() + cycleLength - 12);
    return `${ovStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${ovEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  } catch {
    return "—";
  }
}

function deriveNextPeriod(startDate: string, cycleLength: number): string {
  try {
    const next = new Date(startDate);
    next.setDate(next.getDate() + cycleLength);
    return next.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "—";
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HealthReportPage() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  // userId is resolved once from the seed endpoint on first load.
  // In production, replace seedAndGetUserId() with your auth context (e.g. useAuth().user.id).
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async (month?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Resolve userId: use cached value or seed the DB to get one
      let uid = userId;
      if (!uid) {
        uid = await seedAndGetUserId();
        setUserId(uid);
      }
      const data = await fetchHealthReport(uid, month);
      setReport(data);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError({ message: apiErr.message ?? "Unknown error", status: apiErr.status });
    } finally {
      setLoading(false);
    }
  // userId intentionally omitted — we read it via the setter pattern above
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial load
  useEffect(() => {
    load(selectedMonth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when month filter changes (skip on mount — handled above)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    load(selectedMonth);
  }, [selectedMonth, load]);

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

  const flowChartData = useMemo(() => {
    if (!report) return [];
    return report.flowChartData ?? [];
  }, [report]);

  const donutItems = useMemo(() => {
    if (!report?.donuts?.length) return [];
    // API provides colors directly; fall back to our palette if missing
    return report.donuts.slice(0, 6).map((item, i) => ({
      value: Math.round(item.percentage),
      label: item.label,
      color: item.color || DONUT_COLORS[i % DONUT_COLORS.length],
    }));
  }, [report]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <HealthReportSkeleton />;
  if (error) return <ErrorState error={error} onRetry={() => { setUserId(null); load(selectedMonth); }} />;
  if (!report) return null;

  const { cycleSummary, flowSummary, historicalCycles } = report;

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
            {/* <LineChart data={flowChartData} startDate={cycleSummary.startDate ?? undefined} /> */}
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
     { historicalCycles?.length > 0 ? (
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
              {/* Optional: show time if available */}
              {/* <div className="text-[10px] text-muted-foreground">{row.time}</div> */}
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
      {/* shimmer keyframe (shared with skeleton, harmless if duplicate) */}
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}