import { cn } from "@/lib/utils";
import { AlertCircle, Activity, ChevronRight, Droplet, FileText, Heart, Loader2, Sparkles, TrendingUp, X } from "lucide-react";
import { useState } from "react";

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
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h2 className="text-primary font-semibold">Cycle Highlight</h2>
          <p className="text-xs text-muted-foreground">
            Understand your cycle and take care during peak days
          </p>
        </div>
        <span className="text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap shrink-0">
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Loader2 className="size-3 animate-spin" /> Loading...
            </span>
          ) : (
            `📅 Day ${cycleDay} Tip`
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
    { label: "Didn't take test", emoji: "🧪" },
    { label: "Positive",         emoji: "✅" },
    { label: "Faint line",       emoji: "〰️" },
    { label: "Negative",         emoji: "❌" },
  ];

  return (
    <div className="space-y-4">
      {showRefer && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 flex items-start gap-3">
          <div className="text-xl shrink-0">💕</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Refer your friends to VivaFemini 💕</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Gift your friend 30 days of free Premium to help them thrive
            </p>
          </div>
          <button onClick={() => setShowRefer(false)} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="size-4" />
          </button>
        </div>
      )}

      {showQuiz && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="font-semibold text-sm">Hi! Did you take your pregnancy test?</p>
            <button onClick={() => setShowQuiz(false)} className="text-muted-foreground hover:text-foreground shrink-0">
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quizOptions.map((o) => (
              <button
                key={o.label}
                onClick={() => setQuizAnswer(o.label)}
                className={cn(
                  "rounded-2xl text-rose-500 font-medium px-2 py-2.5 flex flex-col items-center gap-1.5 transition-all text-[10px] leading-tight",
                  quizAnswer === o.label
                    ? "bg-rose-200 ring-1 ring-rose-400"
                    : "bg-rose-50 hover:bg-rose-100",
                )}
              >
                <span className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-base">
                  {o.emoji}
                </span>
                <span className="text-center">{o.label}</span>
              </button>
            ))}
          </div>
          <button className="mt-3 w-full bg-primary text-primary-foreground rounded-full py-2.5 text-xs font-semibold hover:bg-primary/90 transition-colors">
            Apply
          </button>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-primary mb-2">Quick Action</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Log symptoms", icon: <Sparkles className="size-3.5" /> },
            { label: "Log period",   icon: <Droplet  className="size-3.5" /> },
            { label: "Health Report",icon: <FileText  className="size-3.5" /> },
          ].map((q) => (
            <button
              key={q.label}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <span className="size-5 rounded-full bg-white/20 flex items-center justify-center">
                {q.icon}
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