import { cn } from "@/lib/utils";
import { AlertCircle, Activity, ChevronRight, CalendarCheck, Heart, Loader2, Sparkles, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import closeIcon from "@/assets/close-icon.svg";
import megaphone from "@/assets/megaphone.svg";
import positive from "@/assets/positive.svg";
import negative from "@/assets/negative.svg";
import faintLine from "@/assets/faint-line.svg";
import didntTake from "@/assets/didnt-take.svg";
import logPeriod from "@/assets/log-period.svg";
import logSymptoms from "@/assets/log-symptoms.svg";
import healthReport from "@/assets/health-report.svg";

export function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
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

// ── Cycle Highlight ───────────────────────────────────────────────────────────

export function CycleHighlight({ tips, cycleDay, isLoading, error, onRetry }: {
  tips: { icon: string; title: string; body: string; note: string; bg: string }[];
  cycleDay: number; isLoading: boolean; error?: Error | null; onRetry?: () => void;
}) {
  console.log({tips})
  return (
    <div className="bg-white rounded-3xl p-5 md:p-3 shadow-sm border border-border/50">
      <div className="flex items-center text-center flex-col justify-center gap-2 mb-1">
        <div>
          <h2 className="font-bold text-xl text-[#FB3179]">Cycle Highlight</h2>
          <p className="text-sm w-65 text-[#0F172A] text-center">
            Understand your cycle and take care during peak days
          </p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-[#FFABC938] text-[#FB3179] font-bold whitespace-nowrap shrink-0">
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Loader2 className="size-3 animate-spin" /> Loading...
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <CalendarCheck className="size-3 text-[#FB3179]" />
              <span>Day {cycleDay}</span>
            </div>
          )}
        </span>
      </div>

      {error ? (
        <InlineError message="Failed to load highlights" onRetry={onRetry} />
      ) : (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x scrollbar-hide">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[200px] flex-1 rounded-2xl p-4 bg-rose-50 animate-pulse snap-start">
                  <div className="size-8 rounded-full bg-rose-200 mb-3" />
                  <div className="h-3 w-3/4 bg-rose-200 rounded mb-2" />
                  <div className="h-3 w-full bg-rose-200 rounded" />
                  <div className="h-3 w-2/3 bg-rose-200 rounded mt-1" />
                </div>
              ))
            : tips.map((t) => (
                <div 
                style={{ background: t.bg }}
                key={t.title} className={cn("min-w-50 flex-1 snap-start rounded-2xl p-4", t.bg)}>
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{t.title}</h3>
                  <p className="text-base text-[#0F172A] leading-relaxed">{t.body}</p>
                  <div className="mt-3 bg-white rounded-4xl p-3 flex items-center gap-1 text-xs text-primary font-medium">
                    <span className='text-[#000000] font-lighter'>💜{t?.note}</span>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}

// ── Daily Check-Offs ──────────────────────────────────────────────────────────

export function DailyCheckoffs({ topSymptom, mostFrequent, intensityChange, isLoading, error, onRetry }: {
  topSymptom: string; mostFrequent: string; intensityChange: string;
  isLoading: boolean; error?: Error | null; onRetry?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="size-4 text-primary" />
          <h3 className="font-semibold text-sm">Daily Check-Offs</h3>
        </div>
        {error ? (
          <InlineError message="Failed to load" onRetry={onRetry} />
        ) : isLoading ? (
          <div className="space-y-2">
            <div className="h-3 bg-rose-100 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-rose-100 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Top Symptom Today</span>
              <span className="text-rose-500 font-semibold">{topSymptom}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Health Report</span>
              <span className="text-emerald-500 font-semibold">View Report →</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="size-4 text-emerald-500" />
          <h3 className="font-semibold text-sm">Trend Watch</h3>
        </div>
        {error ? (
          <InlineError message="Failed to load" onRetry={onRetry} />
        ) : isLoading ? (
          <div className="space-y-2">
            <div className="h-3 bg-rose-100 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-rose-100 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground shrink-0">Most Frequent Symptom</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-500 font-semibold text-[11px]">
                {mostFrequent}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground shrink-0">Symptom Intensity Change</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-semibold text-[11px]">
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

export function ReferAndQuiz() {
  const [showRefer, setShowRefer] = useState(true);
  const [showQuiz, setShowQuiz]   = useState(true);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const quizOptions = [
    { label: "Didn't take test", emoji: didntTake },
    { label: "Positive",         emoji: positive },
    { label: "Faint line",       emoji: faintLine },
    { label: "Negative",         emoji: negative },
  ];

  return (
    <div className="space-y-2 bg-gray-200 rounded-3xl p-2 shadow-sm border border-border/50">
      {showRefer && (
       <div className="bg-white rounded-md px-4 py-6 shadow-sm border border-border/50 relative">
  
  <button
    onClick={() => setShowRefer(false)}
    className="absolute cursor-pointer top-3 right-3 text-muted-foreground hover:text-foreground"
  >
    <img src={closeIcon} alt="Close" className="size-4" />
  </button>

  {/* Content row */}
  <div className="flex items-center justify-between gap-4">
    
    {/* Left text */}
    <div className="flex-1 min-w-0">
      <p className="font-bold text-[#0F172A] text-sm">
        Refer your friends to VivaFemini 💕💐
      </p>

      <p className="text-[11px] font-medium text-[#6B7280] mt-0.5 leading-relaxed">
        Gift your friend 30 days of free Premium to help them thrive
      </p>
    </div>

    {/* Right image */}
    <img
      src={megaphone}
      alt="Refer"
      className="size-12 shrink-0"
    />
  </div>
       </div>
      )}

      {showQuiz && (
        <div className="bg-white rounded-md p-4 shadow-sm border border-border/50">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="font-semibold text-sm text-[#0F172A]">Hi! Did you take your pregnancy test?</p>
            <button onClick={() => setShowQuiz(false)} className="text-muted-foreground hover:text-foreground shrink-0">
              <img src={closeIcon} alt="Close" className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 justify-evenly">
            {quizOptions.map((o) => (
              <div className="flex flex-col items-center text-center" key={o.label}>
              <button
                onClick={() => setQuizAnswer(o.label)}
                className={cn(
                  "rounded-full font-medium w-12 h-12 justify-center flex flex-col items-center gap-1.5 transition-all text-[10px] leading-tight",
                  quizAnswer === o.label
                    ? "bg-rose-200 ring-1 ring-rose-400"
                    : "bg-rose-50 hover:bg-rose-100",
                )}
                style={{
                  background: "linear-gradient(180deg, #B32070 0%, #FB3179 100%)",
                }}
              >
                <img src={o.emoji} alt={o.label} className="size-6" />
              </button>

              <p className="text-center text-[#0F172A] text-xs mt-1">{o.label}</p>
              </div>
            ))}
          </div>
          
          <div className='mx-auto w-full mt-3 flex justify-center'>
          <button className="mx-auto bg-[#E5E7EB] px-10 text-[#9CA3AF] rounded-full py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors">
            Apply
          </button>
          </div>
        </div>
      )}

      <div className='bg-white rounded-md p-4 shadow-sm border border-border/50'>
        <p className="text-sm font-bold text-[#FB3179] mb-2">Quick Action</p>
        <div className="flex flex-wrap justify-evenly gap-2">
          {[
            { label: "Log symptoms", icon: logSymptoms },
            { label: "Log period",   icon: logPeriod },
            { label: "Health Report",icon: healthReport },
          ].map((q) => (
            <button
              key={q.label}
              className="flex items-center gap-1.5 bg-[#F3F4F6] text-[#0F172A] rounded-full px-4 py-1.5 text-[11px] font-medium hover:bg-primary/90 transition-colors"
            >
              <span 
              style={{ background: "linear-gradient(180deg, #B32070 0%, #FB3179 100%)" }}
              className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <img src={q.icon} alt={q.label} className="size-5" />
              </span>
              {q.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Recommended ───────────────────────────────────────────────────────────────

export function Recommended({ narrative, isLoading }: { narrative: string; isLoading: boolean }) {
  const ARTICLES = [
    {
      title: "5 Ways to Reduce Stress During Your Cycle",
      img: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=70",
    },
    {
      title: "Best Nutrition Tips for Better Energy",
      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=70",
    },
    {
      title: "How Sleep Affects Hormonal Balance",
      img: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&q=70",
    },
  ];

  return (
    <div>
      <h2 className="text-primary font-semibold mb-1">Recommended for You</h2>
      {isLoading ? (
        <div className="h-3 bg-rose-100 rounded animate-pulse w-2/3 mb-3" />
      ) : narrative ? (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{narrative}</p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARTICLES.map((it) => (
          <article
            key={it.title}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-shadow"
          >
            <img src={it.img} alt={it.title} loading="lazy" className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug">{it.title}</h3>
              <button className="mt-2 text-xs text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                Read more <ChevronRight className="size-3" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}