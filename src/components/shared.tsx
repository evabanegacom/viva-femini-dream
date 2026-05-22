import { AlertCircle, RefreshCw } from "lucide-react";
import type { ApiError } from "@/types/health-report-types";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-linear-to-r from-rose-50 via-pink-100/60 to-rose-50 bg-[length:200%_100%] rounded-xl ${className}`}
      style={{ animation: "skeleton-shimmer 1.6s ease-in-out infinite" }}
    />
  );
}

export function Donut({ value, label, color }: { value: number; label: string; color: string }) {
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

export const DONUT_COLORS = [
  "oklch(0.65 0.22 0)",
  "oklch(0.6 0.22 320)",
  "oklch(0.7 0.18 140)",
  "oklch(0.7 0.22 30)",
  "oklch(0.7 0.22 60)",
  "oklch(0.6 0.22 270)",
];


export function HealthReportSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cycle Summary skeleton */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-3">
          <Skeleton className="h-5 w-48" />
          <div className="flex flex-wrap gap-2">
            {[120, 110, 130, 145].map((w, i) => (
              <Skeleton key={i} className="h-7 rounded-full" />
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

export function ErrorState({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
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

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}