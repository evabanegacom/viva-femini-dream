import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/slider";
import { FileEdit, Check, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { seedUserIdQueryOptions } from "@/queries/health-report";
import { cyclesQueryOptions } from "@/queries/cycles";
import { createSymptomLogMutation } from "@/queries/symptoms";

const PHYSICAL_PAIN = [
  "Cramps", "Diarrhoea", "Fatigue", "Headache", "Nausea",
  "Breast tenderness", "Abdominal pain", "Pelvic pain",
  "Water retention", "Lower back pain", "Appetite changes",
];
const MOOD_MENTAL = [
  "Happy", "Neutral", "Sad", "Low Motivation", "Mood swings",
  "Irritability", "Cravings", "Tearfulness", "Difficulty Concentrating",
];
const PERIOD_INDICATORS = ["Spotting", "Heavier flow", "Lighter flow", "Vaginal Dryness"];
const SEXUAL_HEALTH = ["Increased sex drive", "Decreased sex drive", "Vaginal discharge"];

function Pill({
  label, active, onClick, color = "rose",
}: {
  label: string; active: boolean; onClick: () => void; color?: "rose" | "amber";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5",
        active
          ? color === "amber"
            ? "bg-amber-400 text-white border-amber-400 shadow-sm"
            : "bg-primary text-primary-foreground border-primary shadow-sm"
          : color === "amber"
          ? "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
          : "bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100"
      )}
    >
      <span className={cn(
        "size-4 rounded-full flex items-center justify-center text-[9px]",
        active ? "bg-white/30" : color === "amber" ? "bg-amber-200" : "bg-rose-200/60"
      )}>
        {active ? <Check className="size-2.5" /> : "•"}
      </span>
      {label}
    </button>
  );
}

function PillGroup({
  items, color, value, onChange,
}: {
  items: string[]; color?: "rose" | "amber"; value: Set<string>; onChange: (next: Set<string>) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Pill
          key={item}
          label={item}
          color={color}
          active={value.has(item)}
          onClick={() => {
            const next = new Set(value);
            next.has(item) ? next.delete(item) : next.add(item);
            onChange(next);
          }}
        />
      ))}
    </div>
  );
}

export function TrackingPage() {
  const [flow, setFlow] = useState([3]);
  const [notes, setNotes] = useState("");
  const [physical, setPhysical] = useState<Set<string>>(new Set());
  const [mood, setMood] = useState<Set<string>>(new Set());
  const [indicators, setIndicators] = useState<Set<string>>(new Set());
  const [sexual, setSexual] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  // 1. Resolve userId from seed — cached for the session
  const { data: userId, isLoading: isLoadingUser } = useQuery(
    seedUserIdQueryOptions()
  );

  // 2. Fetch cycles for this user — pick index 0 as the active cycle
  const { data: cycles, isLoading: isLoadingCycles } = useQuery({
    ...cyclesQueryOptions(userId ?? ""),
    enabled: !!userId,
  });

  const activeCycle = cycles?.[0];
  const activeCycleId = activeCycle?._id;

  // 3. Today's date at runtime — YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // 4. Mutation — POST /symptoms
  const { mutate, isPending, isError, error } = useMutation({
    ...createSymptomLogMutation(),
    onSuccess: () => {
      setSaved(true);
      setPhysical(new Set());
      setMood(new Set());
      setIndicators(new Set());
      setSexual(new Set());
      setFlow([3]);
      setNotes("");
      setTimeout(() => setSaved(false), 3000);
    },
  });

  function handleSave() {
    if (!userId || !activeCycleId) return;
    mutate({
      userId,
      cycleId: activeCycleId,
      date: today,
      physicalSymptoms: [...physical],
      moodSymptoms: [...mood],
      periodIndicators: [...indicators],
      sexualHealthSymptoms: [...sexual],
      flowIntensity: flow[0],
      notes: notes.trim() || undefined,
    });
  }

  const isResolving = isLoadingUser || isLoadingCycles;
  const canSave = !!userId && !!activeCycleId && !isPending && !isResolving;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

      {/* ── Left col ────────────────────────────────────────────────────── */}
      <div className="lg:col-span-4 space-y-4">

        {/* Welcome card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50 text-center">
          <div className="text-6xl mb-3">🌸</div>
          <h2 className="font-bold text-lg">Welcome,</h2>
          <p className="text-sm text-muted-foreground">How are you doing today?</p>
          {/* Dynamic cycle label from API */}
          {activeCycle?.label && (
            <p className="text-xs text-primary font-medium mt-1">{activeCycle.label}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Track your symptoms daily to understand your state of wellbeing
          </p>
        </div>

        {/* Period Indicators */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-border/50">
          <h3 className="font-semibold text-sm mb-3">Period Indicators</h3>
          <PillGroup items={PERIOD_INDICATORS} value={indicators} onChange={setIndicators} />
        </div>

        {/* Sexual Health */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-border/50">
          <h3 className="font-semibold text-sm mb-3">Sexual Health</h3>
          <PillGroup items={SEXUAL_HEALTH} color="amber" value={sexual} onChange={setSexual} />
        </div>
      </div>

      {/* ── Right col ───────────────────────────────────────────────────── */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-5">

        {/* Physical Pain */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Physical Pain</h3>
          <PillGroup items={PHYSICAL_PAIN} value={physical} onChange={setPhysical} />
        </div>

        {/* Mood & Mental */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Mood & Mental</h3>
          <PillGroup items={MOOD_MENTAL} value={mood} onChange={setMood} />
        </div>

        {/* Flow Intensity */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-sm">Flow Intensity</h3>
              <p className="text-xs text-muted-foreground">How heavy is your flow today?</p>
            </div>
            {/* Dynamic flow value from slider state */}
            <span className="text-xs text-muted-foreground">{flow[0]}/10</span>
          </div>
          <Slider value={flow} onValueChange={setFlow} min={0} max={10} step={1} className="my-3" />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Light</span><span>Medium</span><span>Heavy</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileEdit className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Notes</h3>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note about how you're feeling..."
            className="w-full min-h-[100px] rounded-2xl border border-border bg-muted/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* API error message */}
        {isError && (
          <p className="text-xs text-red-500 text-center">
            {(error as any)?.message ?? "Failed to save. Please try again."}
          </p>
        )}

        {/* No active cycle warning */}
        {!isResolving && !activeCycleId && (
          <p className="text-xs text-amber-500 text-center">
            No active cycle found. Please log a cycle before tracking symptoms.
          </p>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold rounded-full py-3.5 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {isResolving ? (
            <><Loader2 className="size-4 animate-spin" /> Loading...</>
          ) : isPending ? (
            <><Loader2 className="size-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="size-4" /> Saved!</>
          ) : (
            <><Check className="size-4" /> Save</>
          )}
        </button>
      </div>
    </div>
  );
}