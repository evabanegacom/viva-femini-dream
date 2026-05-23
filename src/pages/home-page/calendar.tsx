import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown, ChevronUp, Calendar1  } from "lucide-react";
import { useMemo } from "react";

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">
      <AlertCircle className="size-3.5 shrink-0" />
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="ml-auto underline font-medium">Retry</button>
      )}
    </div>
  );
}

function daysBetween(from: string, to: string) {
  return Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
}

function PulseBoxLight({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-rose-100/70", className)} />;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Calendar({
  expanded, onToggle, cycleDay, monthLabel, year, month,
  periodDays, ovulationDays, todayDate, avgCycleLength,
  nextPeriodDate, fertileWindowStart, isLoading, error, onRetry,
}: {
  expanded: boolean; onToggle: () => void; cycleDay: number;
  monthLabel: string; year: number; month: number;
  periodDays: Set<number>; ovulationDays: Set<number>;
  todayDate: number; avgCycleLength: number;
  nextPeriodDate: string; fertileWindowStart: string;
  isLoading: boolean; error?: Error | null; onRetry?: () => void;
}) {
  const cells = useMemo(() => buildCalendarCells(year, month), [year, month]);
  const daysUntilNext = nextPeriodDate
    ? daysBetween(new Date().toISOString().split("T")[0], nextPeriodDate)
    : null;
  const cyclePercent = avgCycleLength ? Math.round((cycleDay / avgCycleLength) * 100) : 0;
  return (
    <div
  className="overflow-hidden calendar-div text-white shadow-lg relative rounded-b-3xl md:rounded-3xl"
>

      <div className="p-5 md:p-6 relative">
        {/* Header row */}
        <div className="relative flex flex-col gap-2 items-center justify-center mb-1">
  <p className="text-[11px] opacity-80">Today, {formatDate(new Date().toISOString().split("T")[0])} </p>

  <div className="flex items-center gap-1.5 font-bold text-sm mb-4">
          <span><Calendar1 className="size-4" /></span>
            <span>{monthLabel}</span>
            <button
    onClick={onToggle}
    className=" text-white/80 cursor-pointer hover:text-white transition-colors"
  >
    {expanded ? (
      <ChevronUp className="size-4" />
    ) : (
      <ChevronDown className="size-4" />
    )}
  </button>
        </div>
</div>

        {/* Month label */}
        

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-normal opacity-80 mb-2">
          {DAYS.map((d, i) => <div key={i}>{d}</div>)}
        </div>

        {/* Calendar grid */}
        {isLoading ? (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-full bg-white/20 animate-pulse" />
            ))}
          </div>
        ) : expanded ? (
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const safeTodayDate = todayDate === -1 ? 1 : todayDate;
              const isToday = d === safeTodayDate;
              const isPeriod = periodDays.has(d);
              // peak period day is the last day of the period, so the day before ovulation starts
              const peakOv = ovulationDays.has(d + 1) && !ovulationDays.has(d);
              const isOv = ovulationDays.has(d);
              return (
                <div key={i} className={cn(
                  "rounded-full px-6 py-3 font-bold flex items-center justify-center text-[12.5px] transition-all border border-white/40",
                  isToday && "bg-white text-black shadow-md font-bold ring-2 ring-white/60",
                  !isToday && isPeriod && "bg-[#FB3179] text-white",
                  peakOv && "bg-[#FB3179] text-white shadow-sm ring-2 ring-white",
                  // Blue background for ovulation days — matching the screenshot exactly
                  !isToday && isOv && "bg-[#0D34F9] text-white shadow-sm",
                  !isToday && !isPeriod && !isOv && "text-white/90 hover:bg-white/10"
                )}>
                  {d}
                </div>
              );
            })}
          </div>
        ) : (
          // Collapsed — show first 7 non-null days
          <div className="grid grid-cols-7 gap-1.5">
            {cells.filter((d) => d !== null).slice(0, 7).map((d, i) => (
              <div key={i} className={cn(
                  "rounded-full px-6 py-3 font-bold flex items-center justify-center text-[12.5px] transition-all border border-white/40",
                d === todayDate
                  ? "bg-white text-rose-500 shadow-md font-bold ring-2 ring-white/60"
                  : ovulationDays.has(d!)
                  ? "bg-blue-500 text-white"
                  : "text-white/90"
              )}>
                {d}
              </div>
            ))}
          </div>
        )}

        {/* Cycle info card */}
        <div className="bg-white text-foreground rounded-2xl mt-5 p-5 text-center shadow-sm">
          <p className="text-[12.15px] text-[#6B7280] font-semibold mb-2">Today is Cycle Day</p>

          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="mx-auto size-16 rounded-full bg-rose-100 animate-pulse" />
              <PulseBoxLight className="h-3 w-48 mx-auto" />
              <PulseBoxLight className="h-3 w-36 mx-auto" />
              <PulseBoxLight className="h-3 w-40 mx-auto" />
            </div>
          ) : error ? (
            <InlineError message="Failed to load cycle data" onRetry={onRetry} />
          ) : (
            <>
              {/* Big cycle day badge */}
              <div
                className="mx-auto cycle-date size-18 flex items-center justify-center text-[34.5px] font-bold text-white"
              >
                {cycleDay}
              </div>
              {/* Stats row */}
              <p className="text-[11px] mt-2">
                <span className="font-bold text-[#6B7280]">Avg. Cycle: {avgCycleLength} Days </span>· <span className="font-normal text-[#6C7278]">Currently: {cyclePercent}% out of 100</span>
              </p>

              {/* Next period */}
              <div className="mt-3 py-3 rounded-sm w-fit mx-auto px-8 border border-[#FB317999] flex items-center justify-center gap-2 text-xs flex-wrap">
                <span className=" text-[#FB3179] font-normal text-[11px]">
                  Next Period
                </span>
                <span className="text-[#FB3179] text-[12.15px] font-bold">
                  {nextPeriodDate
                    ? `${formatDate(nextPeriodDate)} (${daysUntilNext} Days)`
                    : "—"}
                </span>
              </div>

              {/* Fertile window */}
              {fertileWindowStart && (
                <p className="text-[11px] text-[#6B7280] mt-1.5">
                  <span>Fertile window starts </span>
                  <span className="font-bold">{fertileWindowStart}</span>
                </p>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Calendar;