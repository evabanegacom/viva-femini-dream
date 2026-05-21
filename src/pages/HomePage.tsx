import { ChevronDown, ChevronUp, Heart, Flame, Sparkles, X, ChevronLeft, ChevronRight, Activity, TrendingUp, Droplet, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function buildOctober() {
  // Oct 2025: Oct 1 is Wednesday
  const firstDay = 3; // Wed
  const daysInMonth = 31;
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

const periodDays = new Set([11, 12, 13, 14, 15, 16]);
const ovulationDays = new Set([25, 26, 27, 28, 29]);
const today = 21;

function Calendar({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const cells = buildOctober();
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
          <span>📅 October 2025</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium opacity-90 mb-2">
          {DAYS.map((d, i) => <div key={i}>{d}</div>)}
        </div>

        {expanded ? (
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const isToday = d === today;
              const isPeriod = periodDays.has(d);
              const isOv = ovulationDays.has(d);
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-full flex items-center justify-center text-xs font-medium border",
                    isToday && "bg-white text-rose-500 border-white shadow",
                    !isToday && isPeriod && "bg-rose-600/70 text-white border-transparent",
                    !isToday && isOv && "bg-blue-600 text-white border-transparent",
                    !isToday && !isPeriod && !isOv && "border-white/30 text-white/90"
                  )}
                >
                  {d}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {[1,2,3,4,5,6,7,8,9].slice(0,9).map((d) => (
              <div
                key={d}
                className={cn(
                  "aspect-square rounded-full flex items-center justify-center text-xs font-medium border",
                  d === 1 ? "bg-white text-rose-500 border-white" : "border-white/30 text-white/90"
                )}
              >
                {d}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white text-foreground rounded-2xl mt-5 p-5 text-center relative">
          <p className="text-xs text-muted-foreground mb-1">Today is Cycle Day</p>
          <div className="mx-auto size-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {today}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Avg. Cycle: 28 Days · Currently 75% of 100</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full border border-rose-200 text-rose-500 font-medium">Next Period</span>
            <span className="text-muted-foreground">Nov 12 (17 Days)</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Fertile window starts May 5</p>
        </div>
      </div>
    </div>
  );
}

function CycleHighlight() {
  const tips = [
    { icon: "💧", title: "Stay Hydrated", body: "Drink 2L of water daily to ease cramps and support your health.", bg: "bg-[oklch(0.94_0.05_175)]", note: "8 glasses/day" },
    { icon: "🍵", title: "Stay Comfortable", body: "On heavy flow days, prioritize comfort. Stay hydrated and use heating pads for abdominal relief.", bg: "bg-[oklch(0.94_0.05_350)]", note: "Listen to your body" },
    { icon: "🧘", title: "Gentle Movement", body: "Light stretching or yoga can ease discomfort and lift mood.", bg: "bg-[oklch(0.94_0.05_60)]", note: "Listen to your body" },
  ];
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h2 className="text-primary font-semibold">Cycle Highlight</h2>
          <p className="text-xs text-muted-foreground">Understand your cycle and take care during peak days</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">📅 Day 1 Tip</span>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {tips.map((t) => (
          <div key={t.title} className={cn("min-w-[200px] flex-1 snap-start rounded-2xl p-4", t.bg)}>
            <div className="text-2xl mb-2">{t.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">{t.body}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
              <Heart className="size-3 fill-primary" /> {t.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyCheckoffs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="size-4 text-primary" />
          <h3 className="font-semibold text-sm">Daily Check-Offs</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Symptoms</span>
            <span className="text-rose-500 font-medium">Mild Bleeding, Cramps ↑</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Health Report</span>
            <span className="text-emerald-500 font-medium">Pilates (Logged)</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="size-4 text-emerald-500" />
          <h3 className="font-semibold text-sm">Trend Watch</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Most Frequent Symptom</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-500 font-medium">Bloating</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Symptom Intensity Change</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium">Stable ↘</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferAndQuiz() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold text-sm">Refer your friends to VivaFemini 💕</p>
          <p className="text-xs text-muted-foreground mt-0.5">Gift your friend 30 days of free Premium to help them thrive</p>
        </div>
        <button className="text-muted-foreground"><X className="size-4" /></button>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="font-semibold text-sm">Hi! Did you take your pregnancy test?</p>
          <button className="text-muted-foreground"><X className="size-4" /></button>
        </div>
        <div className="grid grid-cols-4 gap-2 text-[11px]">
          {["Didn't take test", "Positive", "Faint line", "Negative"].map((o) => (
            <button key={o} className="rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 font-medium px-2 py-2 flex flex-col items-center gap-1">
              <span className="size-7 rounded-full bg-primary/10 flex items-center justify-center">🧪</span>
              {o}
            </button>
          ))}
        </div>
        <button className="mt-3 w-full bg-primary text-primary-foreground rounded-full py-2 text-xs font-semibold">Apply</button>
      </div>
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

function Recommended() {
  const items = [
    { title: "5 Ways to Reduce Stress During Your Cycle", img: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=70" },
    { title: "Best Nutrition Tips for Better Energy", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=70" },
    { title: "How Sleep Affects Hormonal Balance", img: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&q=70" },
  ];
  return (
    <div>
      <h2 className="text-primary font-semibold mb-3">Recommended for You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
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

export function HomePage() {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div className="lg:col-span-5 space-y-4">
        <Calendar expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        <ReferAndQuiz />
      </div>
      <div className="lg:col-span-7 space-y-4">
        <CycleHighlight />
        <DailyCheckoffs />
        <Recommended />
      </div>
    </div>
  );
}
