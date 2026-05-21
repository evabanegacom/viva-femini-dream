import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { FileEdit, Check } from "lucide-react";

const physicalPain = ["Cramps", "Diarrhoea", "Fatigue", "Headache", "Nausea", "Breast tenderness", "Abdominal pain", "Pelvic pain", "Water retention", "Lower back pain", "Appetite changes"];
const moodMental = ["Happy", "Neutral", "Sad", "Low Motivation", "Mood swings", "Irritability", "Cravings", "Tearfulness", "Difficulty Concentrating"];
const periodIndicators = ["Spotting", "Heavier flow", "Lighter flow", "Vaginal Dryness"];
const sexualHealth = ["Increased sex drive", "Decreased sex drive", "Vaginal discharge"];

function Pill({ label, active, onClick, color = "rose" }: { label: string; active: boolean; onClick: () => void; color?: "rose" | "amber" }) {
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
      <span className={cn("size-4 rounded-full flex items-center justify-center text-[9px]",
        active ? "bg-white/30" : color === "amber" ? "bg-amber-200" : "bg-rose-200/60"
      )}>
        {active ? <Check className="size-2.5" /> : "•"}
      </span>
      {label}
    </button>
  );
}

function PillGroup({ items, color }: { items: string[]; color?: "rose" | "amber" }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <Pill
          key={i}
          label={i}
          color={color}
          active={selected.has(i)}
          onClick={() => {
            const next = new Set(selected);
            next.has(i) ? next.delete(i) : next.add(i);
            setSelected(next);
          }}
        />
      ))}
    </div>
  );
}

export function TrackingPage() {
  const [flow, setFlow] = useState([3]);
  const [notes, setNotes] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      {/* Left col */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50 text-center">
          <div className="text-6xl mb-3">🌸</div>
          <h2 className="font-bold text-lg">Welcome,</h2>
          <p className="text-sm text-muted-foreground">How are you doing today?</p>
          <p className="text-xs text-muted-foreground mt-2">Get to track your symptoms daily to know your state of wellbeing</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-border/50">
          <h3 className="font-semibold text-sm mb-3">Period Indicators</h3>
          <PillGroup items={periodIndicators} />
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-border/50">
          <h3 className="font-semibold text-sm mb-3">Sexual Health</h3>
          <PillGroup items={sexualHealth} color="amber" />
        </div>
      </div>

      {/* Right col */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 space-y-5">
        <div>
          <h3 className="font-semibold text-sm mb-3">Physical Pain</h3>
          <PillGroup items={physicalPain} />
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3">Mood & Mental</h3>
          <PillGroup items={moodMental} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-sm">Flow Intensity</h3>
              <p className="text-xs text-muted-foreground">How heavy is your flow today?</p>
            </div>
            <span className="text-xs text-muted-foreground">{flow[0]}/10</span>
          </div>
          <Slider value={flow} onValueChange={setFlow} min={0} max={10} step={1} className="my-3" />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Light</span><span>Medium</span><span>Heavy</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileEdit className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Notes</h3>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Inputting Note"
            className="w-full min-h-[100px] rounded-2xl border border-border bg-muted/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full py-3.5 text-sm flex items-center justify-center gap-2 transition-colors">
          Save <Check className="size-4" />
        </button>
      </div>
    </div>
  );
}
