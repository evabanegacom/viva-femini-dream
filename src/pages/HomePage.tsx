import {
  ChevronDown, ChevronUp, Heart, Sparkles, X,
  ChevronRight, Activity, TrendingUp, Droplet, FileText,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { seedUserIdQueryOptions, healthReportQueryOptions } from "@/queries/health-report";
import { cyclesQueryOptions } from "@/queries/cycles";
import { symptomLogsQueryOptions } from "@/queries/symptoms";

// ── Helpers ───────────────────────────────────────────────────────────────────

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysBetween(from: string, to: string) {
  return Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000);
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-rose-100/60", className)} />;
}

function CardLoader() {
  return (
    <div className="space-y-3 p-1">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

// ── Calendar ──────────────────────────────────────────────────────────────────

function Calendar({
  expanded, onToggle, cycleDay, monthLabel, year, month,
  periodDays, ovulationDays, todayDate, avgCycleLength,
  nextPeriodDate, fertileWindowStart, isLoading,
}: {
  expanded: boolean; onToggle: () => void; cycleDay: number;
  monthLabel: string; year: number; month: number;
  periodDays: Set<number>; ovulationDays: Set<number>;
  todayDate: number; avgCycleLength: number;
  nextPeriodDate: string; fertileWindowStart: string; isLoading: boolean;
}) {
  const cells = useMemo(() => buildCalendarCells(year, month), [year, month]);
  const daysUntilNext = nextPeriodDate ? daysBetween(new Date().toISOString().split("T")[0], nextPeriodDate) : null;
  const cyclePercent = avgCycleLength ? Math.round((cycleDay / avgCycleLength) * 100) : 0;

  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 text-white shadow-lg relative">
      <div className="absolute -bottom-8 -right-8 opacity-20 text-[180px] leading-none select-none">🌸</div>
      <div className="p-5 md:p-6 relative">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs opacity-90">Today is Cycle Day</p>
          <button onClick={onToggle} className="text-white/90 hover:text-white">
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
        <div className="flex items-center gap-2 font-semibold mb-4">
          <span>📅 {monthLabel}</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium opacity-90 mb-2">
          {DAYS.map((d, i) => <div key={i}>{d}</div>)}
        </div>

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
              const isToday = d === todayDate;
              const isPeriod = periodDays.has(d);
              const isOv = ovulationDays.has(d);
              return (
                <div key={i} className={cn(
                  "aspect-square rounded-full flex items-center justify-center text-xs font-medium border",
                  isToday && "bg-white text-rose-500 border-white shadow",
                  !isToday && isPeriod && "bg-rose-600/70 text-white border-transparent",
                  !isToday && isOv && "bg-blue-600 text-white border-transparent",
                  !isToday && !isPeriod && !isOv && "border-white/30 text-white/90"
                )}>
                  {d}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {cells.filter(Boolean).slice(0, 7).map((d, i) => (
              <div key={i} className={cn(
                "aspect-square rounded-full flex items-center justify-center text-xs font-medium border",
                d === todayDate ? "bg-white text-rose-500 border-white" : "border-white/30 text-white/90"
              )}>
                {d}
              </div>
            ))}
          </div>
        )}

        {/* Cycle info card */}
        <div className="bg-white text-foreground rounded-2xl mt-5 p-5 text-center">
          <p className="text-xs text-muted-foreground mb-1">Today is Cycle Day</p>
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="mx-auto size-16 rounded-full bg-rose-100 animate-pulse" />
              <Skeleton className="h-3 w-48 mx-auto" />
              <Skeleton className="h-3 w-36 mx-auto" />
            </div>
          ) : (
            <>
              <div className="mx-auto size-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {cycleDay}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Avg. Cycle: {avgCycleLength} Days · Currently {cyclePercent}% complete
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full border border-rose-200 text-rose-500 font-medium">Next Period</span>
                <span className="text-muted-foreground">
                  {nextPeriodDate ? `${formatDate(nextPeriodDate)} (${daysUntilNext} Days)` : "—"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                {fertileWindowStart ? `Fertile window starts ${fertileWindowStart}` : ""}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Cycle Highlight ───────────────────────────────────────────────────────────

function CycleHighlight({ tips, cycleDay, isLoading }: {
  tips: { icon: string; title: string; body: string; note: string; bg: string }[];
  cycleDay: number; isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h2 className="text-primary font-semibold">Cycle Highlight</h2>
          <p className="text-xs text-muted-foreground">Understand your cycle and take care during peak days</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
          {isLoading ? "📅 Loading..." : `📅 Day ${cycleDay} Tip`}
        </span>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-[200px] flex-1 rounded-2xl p-4 bg-rose-50 animate-pulse">
              <div className="size-8 rounded-full bg-rose-200 mb-3" />
              <Skeleton className="h-3 w-3/4 mb-2 bg-rose-200" />
              <Skeleton className="h-3 w-full bg-rose-200" />
              <Skeleton className="h-3 w-2/3 mt-1 bg-rose-200" />
            </div>
          ))
        ) : (
          tips.map((t) => (
            <div key={t.title} className={cn("min-w-[200px] flex-1 snap-start rounded-2xl p-4", t.bg)}>
              <div className="text-2xl mb-2">{t.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">{t.body}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                <Heart className="size-3 fill-primary" /> {t.note}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Daily Check-Offs ──────────────────────────────────────────────────────────

function DailyCheckoffs({ topSymptom, mostFrequent, intensityChange, isLoading }: {
  topSymptom: string; mostFrequent: string; intensityChange: string; isLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="size-4 text-primary" />
          <h3 className="font-semibold text-sm">Daily Check-Offs</h3>
        </div>
        {isLoading ? <CardLoader /> : (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Top Symptom Today</span>
              <span className="text-rose-500 font-medium">{topSymptom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Health Report</span>
              <span className="text-emerald-500 font-medium">View Report →</span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="size-4 text-emerald-500" />
          <h3 className="font-semibold text-sm">Trend Watch</h3>
        </div>
        {isLoading ? <CardLoader /> : (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Most Frequent Symptom</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-500 font-medium">
                {mostFrequent}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Symptom Intensity</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium">
                {intensityChange}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Refer & Quiz ──────────────────────────────────────────────────────────────

function ReferAndQuiz() {
  const [showRefer, setShowRefer] = useState(true);
  const [showQuiz, setShowQuiz] = useState(true);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {showRefer && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 flex items-start gap-3">
          <div className="flex-1">
            <p className="font-semibold text-sm">Refer your friends to VivaFemini 💕</p>
            <p className="text-xs text-muted-foreground mt-0.5">Gift your friend 30 days of free Premium to help them thrive</p>
          </div>
          <button onClick={() => setShowRefer(false)} className="text-muted-foreground"><X className="size-4" /></button>
        </div>
      )}
      {showQuiz && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="font-semibold text-sm">Hi! Did you take your pregnancy test?</p>
            <button onClick={() => setShowQuiz(false)} className="text-muted-foreground"><X className="size-4" /></button>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[11px]">
            {["Didn't take test", "Positive", "Faint line", "Negative"].map((o) => (
              <button
                key={o}
                onClick={() => setQuizAnswer(o)}
                className={cn(
                  "rounded-full text-rose-500 font-medium px-2 py-2 flex flex-col items-center gap-1 transition-all",
                  quizAnswer === o ? "bg-rose-200" : "bg-rose-50 hover:bg-rose-100"
                )}
              >
                <span className="size-7 rounded-full bg-primary/10 flex items-center justify-center">🧪</span>
                {o}
              </button>
            ))}
          </div>
          <button className="mt-3 w-full bg-primary text-primary-foreground rounded-full py-2 text-xs font-semibold">Apply</button>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-primary mb-2">Quick Action</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Log symptoms", icon: <Sparkles className="size-3.5" /> },
            { label: "Log period", icon: <Droplet className="size-3.5" /> },
            { label: "Health Report", icon: <FileText className="size-3.5" /> },
          ].map((q) => (
            <button key={q.label} className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-xs font-medium">
              <span className="size-5 rounded-full bg-white/20 flex items-center justify-center">{q.icon}</span>
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Recommended ───────────────────────────────────────────────────────────────

function Recommended({ narrative, isLoading }: { narrative: string; isLoading: boolean }) {
  // Articles are editorial content — not from the health API
  const ARTICLES = [
    { title: "5 Ways to Reduce Stress During Your Cycle", img: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=70" },
    { title: "Best Nutrition Tips for Better Energy", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=70" },
    { title: "How Sleep Affects Hormonal Balance", img: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&q=70" },
  ];

  return (
    <div>
      <h2 className="text-primary font-semibold mb-1">Recommended for You</h2>
      {/* Dynamic narrative from health report */}
      {isLoading ? (
        <Skeleton className="h-3 w-2/3 mb-3" />
      ) : narrative ? (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{narrative}</p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARTICLES.map((it) => (
          <article key={it.title} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
            <img src={it.img} alt={it.title} loading="lazy" className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug">{it.title}</h3>
              <button className="mt-2 text-xs text-primary font-medium inline-flex items-center gap-1">
                Read more <ChevronRight className="size-3" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ── Phase-aware tips (derived from cycle day from API) ────────────────────────

function getTipsForCycleDay(day: number) {
  if (day <= 5) return [
    { icon: "🍵", title: "Stay Comfortable", body: "On heavy flow days, prioritize comfort. Stay hydrated and use heating pads for relief.", bg: "bg-[oklch(0.94_0.05_350)]", note: "Listen to your body" },
    { icon: "💧", title: "Stay Hydrated", body: "Drink 2L of water daily to ease cramps and support your health.", bg: "bg-[oklch(0.94_0.05_175)]", note: "8 glasses/day" },
    { icon: "🧘", title: "Gentle Movement", body: "Light stretching or yoga can ease discomfort and lift mood.", bg: "bg-[oklch(0.94_0.05_60)]", note: "Listen to your body" },
  ];
  if (day <= 13) return [
    { icon: "⚡", title: "High Energy Phase", body: "Your energy is rising. Great time for cardio and strength training.", bg: "bg-[oklch(0.94_0.05_60)]", note: "Push your limits" },
    { icon: "🥗", title: "Eat Light & Fresh", body: "Focus on iron-rich foods to replenish after your period.", bg: "bg-[oklch(0.94_0.05_175)]", note: "Nourish yourself" },
    { icon: "🌞", title: "Social & Productive", body: "You may feel more social and focused. Use this energy wisely.", bg: "bg-[oklch(0.94_0.05_220)]", note: "You've got this" },
  ];
  if (day <= 17) return [
    { icon: "🌸", title: "Ovulation Phase", body: "You're at peak fertility. Energy and confidence are high.", bg: "bg-[oklch(0.94_0.05_350)]", note: "Peak vitality" },
    { icon: "💪", title: "Strength Training", body: "Leverage high estrogen for best workout performance.", bg: "bg-[oklch(0.94_0.05_60)]", note: "Go for it" },
    { icon: "💧", title: "Stay Hydrated", body: "Drink plenty of water to support your body during ovulation.", bg: "bg-[oklch(0.94_0.05_175)]", note: "8 glasses/day" },
  ];
  return [
    { icon: "🧘", title: "Wind Down", body: "Your body is preparing for the next cycle. Rest and recover.", bg: "bg-[oklch(0.94_0.05_60)]", note: "Rest is productive" },
    { icon: "🍫", title: "Manage Cravings", body: "PMS cravings are real. Opt for dark chocolate and complex carbs.", bg: "bg-[oklch(0.94_0.05_350)]", note: "Be kind to yourself" },
    { icon: "😴", title: "Prioritise Sleep", body: "Aim for 8 hours. Progesterone dips can disrupt sleep.", bg: "bg-[oklch(0.94_0.05_220)]", note: "Sleep heals" },
  ];
}

// ── HomePage ──────────────────────────────────────────────────────────────────

export function HomePage() {
  const [expanded, setExpanded] = useState(true);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayStr = now.toISOString().split("T")[0];

  // ── Queries ─────────────────────────────────────────────────────────────────

  const { data: userId } = useQuery(seedUserIdQueryOptions());

  const { data: cycles, isLoading: isLoadingCycles } = useQuery({
    ...cyclesQueryOptions(userId ?? ""),
    enabled: !!userId,
  });

  const { data: report, isLoading: isLoadingReport } = useQuery({
    ...healthReportQueryOptions(userId ?? ""),
    enabled: !!userId,
  });

  const { data: symptomLogs, isLoading: isLoadingSymptoms } = useQuery({
    ...symptomLogsQueryOptions(userId ?? ""),
    enabled: !!userId,
  });

  const isLoading = isLoadingCycles || isLoadingReport || isLoadingSymptoms;

  // ── Derived values from API data ────────────────────────────────────────────

  const activeCycle = cycles?.[0];

  // Cycle day — how many days since period started
  const cycleDay = useMemo(() => {
    if (!activeCycle?.startDate) return 1;
    return Math.max(1, daysBetween(activeCycle.startDate, todayStr) + 1);
  }, [activeCycle, todayStr]);

  // Mark period days on calendar from cycle start/end dates
  const periodDays = useMemo(() => {
    if (!activeCycle?.startDate) return new Set<number>();
    const start = new Date(activeCycle.startDate);
    const end = activeCycle.endDate
      ? new Date(activeCycle.endDate)
      : new Date(start.getTime() + 5 * 86400000);
    const days = new Set<number>();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() === month) days.add(d.getDate());
    }
    return days;
  }, [activeCycle, month]);

  // Mark ovulation window — typically 14 days before end of cycle
  const ovulationDays = useMemo(() => {
    if (!activeCycle?.startDate || !activeCycle?.cycleLength) return new Set<number>();
    const ovStart = new Date(activeCycle.startDate);
    ovStart.setDate(ovStart.getDate() + (activeCycle.cycleLength - 14) - 2);
    const days = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const d = new Date(ovStart);
      d.setDate(d.getDate() + i);
      if (d.getMonth() === month) days.add(d.getDate());
    }
    return days;
  }, [activeCycle, month]);

  // All values from API — no fallback hardcoded strings
  const avgCycleLength = report?.cycleSummary?.cycleLength ?? activeCycle?.cycleLength ?? 0;
  const nextPeriodDate = report?.cycleSummary?.estimatedNextPeriod ?? "";
  const fertileWindowStart = report?.cycleSummary?.ovulationWindow ?? "";
  const narrative = report?.flowSummary?.narrative ?? "";
  const mostFrequent = report?.donuts?.[0]?.label ?? "—";

  // Intensity change derived from donut percentages
  const intensityChange = useMemo(() => {
    if (!report?.donuts?.length) return "—";
    const top = report.donuts[0];
    return top.percentage > 60 ? "High ↑" : top.percentage > 30 ? "Moderate →" : "Stable ↘";
  }, [report]);

  // Today's top symptom from symptom logs
  const topSymptom = useMemo(() => {
    if (!Array.isArray(symptomLogs)) return "—";
    const todayEntry = (symptomLogs as any[]).find((l: any) => l.date?.startsWith(todayStr));
    if (!todayEntry) return "None logged";
    return (
      todayEntry.physicalSymptoms?.[0] ??
      todayEntry.moodSymptoms?.[0] ??
      todayEntry.periodIndicators?.[0] ??
      "None logged"
    );
  }, [symptomLogs, todayStr]);

  // Tips derived from cycle day (which comes from API cycle data)
  const tips = useMemo(() => getTipsForCycleDay(cycleDay), [cycleDay]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div className="lg:col-span-5 space-y-4">
        <Calendar
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          cycleDay={cycleDay}
          monthLabel={monthLabel}
          year={year}
          month={month}
          periodDays={periodDays}
          ovulationDays={ovulationDays}
          todayDate={todayDate}
          avgCycleLength={avgCycleLength}
          nextPeriodDate={nextPeriodDate}
          fertileWindowStart={fertileWindowStart}
          isLoading={isLoading}
        />
        <ReferAndQuiz />
      </div>
      <div className="lg:col-span-7 space-y-4">
        <CycleHighlight tips={tips} cycleDay={cycleDay} isLoading={isLoading} />
        <DailyCheckoffs
          topSymptom={topSymptom}
          mostFrequent={mostFrequent}
          intensityChange={intensityChange}
          isLoading={isLoading}
        />
        <Recommended narrative={narrative} isLoading={isLoading} />
      </div>
    </div>
  );
}