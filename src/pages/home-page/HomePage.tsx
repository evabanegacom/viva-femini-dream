import { useState, useMemo } from "react";
import { daysBetween, daysInMonth, getTipsForCycleDay, parseLocalDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { seedUserIdQueryOptions, healthReportQueryOptions } from "@/queries/health-report";
import { cyclesQueryOptions } from "@/queries/cycles";
import { symptomLogsQueryOptions } from "@/queries/symptoms";
import Calendar from "@/pages/home-page/calendar";
import { ReferAndQuiz, CycleHighlight, DailyCheckoffs, Recommended } from "./shared";

export function HomePage() {
  const [expanded, setExpanded] = useState(true);

  // Use local date string to avoid UTC shift
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-"); // "2026-05-23"

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data: userId, isLoading: isLoadingUser, error: userError, refetch: refetchUser } =
    useQuery(seedUserIdQueryOptions());

  const { data: cycles, isLoading: isLoadingCycles, error: cyclesError, refetch: refetchCycles } =
    useQuery({ ...cyclesQueryOptions(userId ?? ""), enabled: !!userId });

  const { data: report, isLoading: isLoadingReport, error: reportError, refetch: refetchReport } =
    useQuery({ ...healthReportQueryOptions(userId ?? ""), enabled: !!userId });

  const { data: symptomLogs, isLoading: isLoadingSymptoms, error: symptomsError, refetch: refetchSymptoms } =
    useQuery({ ...symptomLogsQueryOptions(userId ?? ""), enabled: !!userId });

  const isLoading      = isLoadingUser || isLoadingCycles || isLoadingReport || isLoadingSymptoms;
  const calendarError  = (userError || cyclesError || reportError) as Error | null;
  const checkoffError  = (symptomsError || reportError) as Error | null;

  function handleCalendarRetry() {
    if (userError) refetchUser();
    else if (cyclesError) refetchCycles();
    else refetchReport();
  }

  // ── Active cycle (most recent = index 0, API sorts newest first) ──────────

  const activeCycle = cycles?.[0];

  // ── Calendar month/year — read from cycle.startDate, NOT today ────────────
  // This ensures the calendar always shows the correct month for the active cycle.
  const { calYear, calMonth, monthLabel, todayDate } = useMemo(() => {
    if (activeCycle?.startDate) {
      const base = parseLocalDate(activeCycle.startDate);
      const bY   = base.getFullYear();
      const bM   = base.getMonth();
      return {
        calYear:    bY,
        calMonth:   bM,
        monthLabel: base.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        // Only highlight today if the calendar is showing the current month
        todayDate:
          today.getFullYear() === bY && today.getMonth() === bM
            ? today.getDate()
            : -1,
      };
    }
    return {
      calYear:    today.getFullYear(),
      calMonth:   today.getMonth(),
      monthLabel: today.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      todayDate:  today.getDate(),
    };
  }, [activeCycle]);

  // ── Cycle day — days since period start, min 1 ───────────────────────────

  const cycleDay = useMemo(() => {
    if (!activeCycle?.startDate) return 1;
    const diff = daysBetween(activeCycle.startDate, todayStr);
    return Math.max(1, diff + 1);
  }, [activeCycle, todayStr]);

  // ── Period days — from API startDate + periodLength ───────────────────────
  // Uses stored periodLength so no hardcoded "5 days" fallback

  const periodDays = useMemo((): Set<number> => {
    if (!activeCycle?.startDate) return new Set();
    const start = activeCycle.startDate;
    const end   = activeCycle.endDate
      // Ended cycles: use stored endDate
      ? activeCycle.endDate
      // Ongoing: estimate from startDate + periodLength
      : (() => {
          const d = parseLocalDate(start);
          d.setDate(d.getDate() + (activeCycle.periodLength ?? 4) - 1);
          return [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0"),
          ].join("-");
        })();
    return daysInMonth(start, end, calYear, calMonth);
  }, [activeCycle, calYear, calMonth]);

  // ── Ovulation days — READ DIRECTLY from API fields ───────────────────────
  // cycle.ovulationStartDate & cycle.ovulationEndDate are set by the seed service.
  // No recalculation needed — trust the backend.

  const ovulationDays = useMemo((): Set<number> => {
    if (!activeCycle?.ovulationStartDate || !activeCycle?.ovulationEndDate) return new Set();
    return daysInMonth(
      activeCycle.ovulationStartDate,
      activeCycle.ovulationEndDate,
      calYear,
      calMonth,
    );
  }, [activeCycle, calYear, calMonth]);

  // ── Values passed to Calendar and cards — all from API ───────────────────

  const avgCycleLength = activeCycle?.cycleLength ?? report?.cycleSummary?.cycleLength ?? 29;

  // nextPeriodDate: ISO string e.g. "2026-05-30" — Calendar formats it for display
  const nextPeriodDate = activeCycle?.estimatedNextPeriod
    ?? report?.cycleSummary?.nextPeriodDate
    ?? "";

    console.log({activeCycle, report})
  // fertileWindowStart: formatted string for display e.g. "May 12"
  const fertileWindowStart = report?.cycleSummary?.ovulationWindow
    ?? (activeCycle?.ovulationStartDate
      ? parseLocalDate(activeCycle.ovulationStartDate).toLocaleDateString("en-US", {
          month: "short", day: "numeric",
        })
      : "");

  const narrative    = report?.flowSummary?.narrative ?? "";
  const mostFrequent = report?.donuts?.[0]?.label ?? "—";

  const intensityChange = useMemo(() => {
    const donuts = report?.donuts;
    if (!donuts?.length) return "—";
    const top = donuts[0];
    return top.percentage > 60 ? "High ↑" : top.percentage > 30 ? "Moderate →" : "Stable ↘";
  }, [report]);

  // Today's top symptom from today's log entry
  const topSymptom = useMemo(() => {
    if (!Array.isArray(symptomLogs)) return "—";
    const todayEntry = (symptomLogs as any[]).find((l: any) => l.date === todayStr);
    if (!todayEntry) return "None logged";
    return (
      todayEntry.physicalSymptoms?.[0] ??
      todayEntry.moodSymptoms?.[0]     ??
      todayEntry.periodIndicators?.[0] ??
      "None logged"
    );
  }, [symptomLogs, todayStr]);

  const tips = useMemo(() => getTipsForCycleDay(cycleDay), [cycleDay]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

      {/* ── Left column ───────────────────────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <Calendar
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          cycleDay={cycleDay}
          monthLabel={monthLabel}
          year={calYear}
          month={calMonth}
          periodDays={periodDays}
          ovulationDays={ovulationDays}
          todayDate={todayDate}
          avgCycleLength={avgCycleLength}
          nextPeriodDate={nextPeriodDate}
          fertileWindowStart={fertileWindowStart}
          isLoading={isLoadingUser || isLoadingCycles || isLoadingReport}
          error={calendarError}
          onRetry={handleCalendarRetry}
        />
        
        <ReferAndQuiz />
      </div>

      {/* ── Right column ──────────────────────────────────────────────── */}
      <div className="lg:col-span-7 space-y-4">
        <CycleHighlight
          tips={tips}
          cycleDay={cycleDay}
          isLoading={isLoadingCycles || isLoadingReport}
          error={reportError as Error | null}
          onRetry={refetchReport}
        />
        <DailyCheckoffs
          topSymptom={topSymptom}
          mostFrequent={mostFrequent}
          intensityChange={intensityChange}
          isLoading={isLoadingReport || isLoadingSymptoms}
          error={checkoffError}
          onRetry={() => { refetchReport(); refetchSymptoms(); }}
        />
        <Recommended narrative={narrative} isLoading={isLoadingReport} />
      </div>
    </div>
  );
}