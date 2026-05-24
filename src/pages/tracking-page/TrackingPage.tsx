import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/slider";
import { FileEdit, Check, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { seedUserIdQueryOptions } from "@/queries/health-report";
import { cyclesQueryOptions } from "@/queries/cycles";
import { createSymptomLogMutation } from "@/queries/symptoms";
import { trackingCategoriesQueryOptions } from "@/queries/tracking";
import handHolding from "@/assets/hand-holding.svg";
import textareaNotes from "@/assets/textarea-notes.svg";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SymptomCategories {
  physicalPain:      string[];
  moodMental:        string[];
  periodIndicators:  string[];
  sexualHealth:      string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function localTodayISO(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

// ── Pill ──────────────────────────────────────────────────────────────────────

function Pill({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 cursor-pointer rounded-full border border-[#FB3179] text-xs transition-all flex items-center gap-1.5",
        active
          ? "bg-[#FB3179] text-white border-[#FB3179] shadow-sm"
          : "bg-[#FFE9F5] text-rose-500 border-[#FB3179] hover:bg-rose-100",
      )}
    >
      {label}
    </button>
  );
}

// ── PillGroup ─────────────────────────────────────────────────────────────────

function PillGroup({ items, value, onChange, loading = false }: {
  items: string[];
  value: Set<string>;
  onChange: (next: Set<string>) => void;
  loading?: boolean;
}) {
  // Show pulse skeleton while categories are loading from API
  if (loading || !items.length) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-20 rounded-full bg-rose-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Pill
          key={item}
          label={item}
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

// ── TrackingPage ──────────────────────────────────────────────────────────────

export function TrackingPage() {
  // ── Local state ─────────────────────────────────────────────────────────
  const [flow,       setFlow]       = useState([3]);
  const [notes,      setNotes]      = useState("");
  const [physical,   setPhysical]   = useState<Set<string>>(new Set());
  const [mood,       setMood]       = useState<Set<string>>(new Set());
  const [indicators, setIndicators] = useState<Set<string>>(new Set());
  const [sexual,     setSexual]     = useState<Set<string>>(new Set());
  const [saved,      setSaved]      = useState(false);

  // ── 1. userId ────────────────────────────────────────────────────────────
  const { data: userId, isLoading: isLoadingUser } =
    useQuery(seedUserIdQueryOptions());

  // ── 2. Active cycle ──────────────────────────────────────────────────────
  // GET /api/v1/cycles?userId=...  → cycles[0] is the current (newest) cycle
  const { data: cycles, isLoading: isLoadingCycles } = useQuery({
    ...cyclesQueryOptions(userId ?? ""),
    enabled: !!userId,
  });

  const activeCycle   = cycles?.[0];
  const activeCycleId = activeCycle?._id;

  // Cycle label for the welcome card e.g. "May 2026"
  const cycleLabel    = activeCycle?.label ?? "";

  const { data: categories, isLoading: isLoadingCategories } =
    useQuery<SymptomCategories>(trackingCategoriesQueryOptions());

  // Destructure from API response — empty arrays until loaded (PillGroup shows skeleton)
  const physicalItems  = categories?.physicalPain     ?? [];
  const moodItems      = categories?.moodMental        ?? [];
  const indicatorItems = categories?.periodIndicators  ?? [];
  const sexualItems    = categories?.sexualHealth      ?? [];

  // ── 4. Today string (local time) ─────────────────────────────────────────
  const today = useMemo(() => localTodayISO(), []);

  // ── 5. Save mutation ─────────────────────────────────────────────────────
  // POST /api/v1/symptoms
  const { mutate, isPending, isError, error } = useMutation({
    ...createSymptomLogMutation(),
    onSuccess: () => {
      setSaved(true);
      // Reset all selections after successful save
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
      cycleId:              activeCycleId,   // from cycles[0]._id
      date:                 today,            // local YYYY-MM-DD
      physicalSymptoms:     [...physical],    // from categories.physicalPain selections
      moodSymptoms:         [...mood],        // from categories.moodMental selections
      periodIndicators:     [...indicators],  // from categories.periodIndicators selections
      sexualHealthSymptoms: [...sexual],      // from categories.sexualHealth selections
      flowIntensity:        flow[0],          // 0–10 from slider
      notes:                notes.trim() || undefined,
    });
  }

  const isResolving = isLoadingUser || isLoadingCycles || isLoadingCategories;
  const canSave     = !!userId && !!activeCycleId && !isPending && !isResolving;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mx-auto">

      {/* ── Left column ─────────────────────────────────────────────────── */}
      <div className="lg:col-span-4 space-y-4 mx-auto w-full">

        {/* Welcome card */}
        <div className="bg-white rounded py-20 px-6 shadow-sm border border-[#E8E8E8] text-center">
          <img src={handHolding} alt="Hand Holding" className="mx-auto" />
          <h2 className="font-semibold text-xl text-[#111827]">Welcome,</h2>
          <p className="text-sm text-muted-foreground">How are you doing today?</p>

          {/* Cycle label from API — e.g. "May 2026" from activeCycle.label */}
          {isLoadingCycles ? (
            <div className="h-3 w-20 bg-rose-100 rounded-full animate-pulse mx-auto mt-1" />
          ) : cycleLabel ? (
            <p className="text-xs text-primary font-medium mt-1">{cycleLabel}</p>
          ) : null}

          <p className="text-xs text-[#6B7280] mt-1.5 mx-auto max-w-[220px]">
            Track your symptoms daily to understand your state of wellbeing
          </p>
        </div>

        {/* Period Indicators + Sexual Health */}
        <div className="border bg-white border-[#E8E8E8] rounded p-5 shadow-sm space-y-5">

          <div>
            <h3 className="font-semibold text-[#0F172A] mb-3">Period Indicators</h3>
            {/*
              Items from GET /tracking/symptom-categories → periodIndicators
              e.g. ["Spotting", "Heavier flow", "Lighter flow", "Vaginal Dryness"]
            */}
            <PillGroup
              items={indicatorItems}
              value={indicators}
              onChange={setIndicators}
              loading={isLoadingCategories}
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#0F172A] mb-3">Sexual Health</h3>
            {/*
              Items from GET /tracking/symptom-categories → sexualHealth
              e.g. ["Increased sex drive", "Decreased sex drive", "Vaginal discharge"]
            */}
            <PillGroup
              items={sexualItems}
              value={sexual}
              onChange={setSexual}
              loading={isLoadingCategories}
            />
          </div>
        </div>
      </div>

      {/* ── Right column ────────────────────────────────────────────────── */}
      <div className="lg:col-span-8 bg-white rounded p-5 md:p-6 shadow-sm border border-[#E8E8E8] space-y-5">

        {/* Physical Pain */}
        <div>
          <h3 className="font-semibold text-[#0F172A] mb-3">Physical Pain</h3>
          {/*
            Items from GET /tracking/symptom-categories → physicalPain
            e.g. ["Cramps", "Diarrhoea", "Fatigue", "Headache", ...]
          */}
          <PillGroup
            items={physicalItems}
            value={physical}
            onChange={setPhysical}
            loading={isLoadingCategories}
          />
        </div>

        {/* Mood & Mental */}
        <div>
          <h3 className="font-semibold text-[#0F172A] mb-3">Mood &amp; Mental</h3>
          {/*
            Items from GET /tracking/symptom-categories → moodMental
            e.g. ["Happy", "Neutral", "Sad", "Low Motivation", ...]
          */}
          <PillGroup
            items={moodItems}
            value={mood}
            onChange={setMood}
            loading={isLoadingCategories}
          />
        </div>

        {/* Flow Intensity */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Flow Intensity</h3>
              <p className="font-medium text-[#6B7280]">How heavy is your flow today?</p>
            </div>
            {/* Live value from slider state — not hardcoded */}
            <span className="text-xs text-muted-foreground font-semibold">
              {flow[0]}/10
            </span>
          </div>
          <Slider
            value={flow}
            onValueChange={setFlow}
            min={0}
            max={10}
            step={1}
            className="my-3"
          />
          <div className="flex justify-between text-[13px] font-medium text-[#6B7280] px-1">
            <span>Light</span>
            <span>Medium</span>
            <span>Heavy</span>
          </div>
        </div>

        {/* Notes */}
        <div className='border border-[#C8C8C8] p-3 rounded-sm'>
          <img src={textareaNotes} alt="Notes" className="mb-2" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Inputting notes"
            className="w-full min-h-30 border-0 text-sm focus:outline-none resize-none"
          />
        </div>

        {/* API save error */}
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

        {/* Date being saved — shows user exactly what date this entry logs to */}
        {!isResolving && activeCycleId && (
          <p className="text-xs text-muted-foreground text-center">
            Logging for{" "}
            <span className="font-medium text-foreground">{today}</span>
            {cycleLabel && (
              <span className="text-muted-foreground"> · {cycleLabel}</span>
            )}
          </p>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full bg-[#FB3179] cursor-pointer hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-full py-3.5 text-sm flex items-center justify-center gap-2 transition-colors"
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