import { Download, FileText, ChevronDown } from "lucide-react";
import { useMemo } from "react";

const summary = [
  { label: "Cycle Length", value: "28 Days", color: "bg-rose-50 text-rose-600", icon: "🌸" },
  { label: "Period Duration", value: "6 Days", color: "bg-amber-50 text-amber-600", icon: "💧" },
  { label: "Estimated Next Period", value: "Nov 1", color: "bg-purple-50 text-purple-600", icon: "📅" },
  { label: "Ovulation Window", value: "Oct 17–22", color: "bg-blue-50 text-blue-600", icon: "🔵" },
];

const chartData = [3, 4, 6, 8, 5, 7, 9, 7, 6, 4, 5, 3, 2];

function LineChart() {
  const w = 600, h = 200, pad = 30;
  const max = 10;
  const stepX = (w - pad * 2) / (chartData.length - 1);
  const pts = chartData.map((v, i) => [pad + i * stepX, h - pad - (v / max) * (h - pad * 2)] as const);
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${path} L${pts[pts.length-1][0]},${h-pad} L${pts[0][0]},${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.7 0.22 0)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.7 0.22 0)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 2, 4, 6, 8, 10].map((y) => (
        <line key={y} x1={pad} x2={w - pad} y1={h - pad - (y / max) * (h - pad * 2)} y2={h - pad - (y / max) * (h - pad * 2)} stroke="oklch(0.93 0.01 320)" strokeDasharray="2 4" />
      ))}
      <path d={area} fill="url(#grad)" />
      <path d={path} fill="none" stroke="oklch(0.62 0.22 0)" strokeWidth="2.5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="white" stroke="oklch(0.62 0.22 0)" strokeWidth="2" />
      ))}
      {chartData.map((_, i) => (
        <text key={i} x={pad + i * (w - pad * 2) / (chartData.length - 1)} y={h - 8} textAnchor="middle" fontSize="9" fill="oklch(0.5 0.03 320)">
          {`10-${(i + 1).toString().padStart(2, '0')}`}
        </text>
      ))}
    </svg>
  );
}

function Donut({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="oklch(0.94 0.01 320)" strokeWidth="7" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} />
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

export function HealthReportPage() {
  const rows = useMemo(
    () => Array.from({ length: 12 }).map((_, i) => ({
      date: `Oct ${(15 + i).toString().padStart(2, '0')}th`,
      time: "01:42 am",
      symptom: "Physical Pain",
      total: ["8/10", "5/10", "7/10", "6/10", "8/10", "4/10", "9/10"][i % 7],
      note: "After lunch",
    })),
    []
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cycle Summary */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold mb-4">Cycle Summary – October 2025</h2>
          <div className="flex flex-wrap gap-2">
            {summary.map((s) => (
              <div key={s.label} className={`${s.color} px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5`}>
                <span>{s.icon}</span>
                <span className="opacity-70">{s.label}:</span>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flow & Symptom Summary */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold">Flow & Symptom Summary</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Understand your symptoms linked to sleep & activity</p>
          <p className="text-xs text-foreground/80 mt-3 leading-relaxed">
            Your average cycle length is 28 days. PMS symptoms were more frequent this month. Flow pattern remains within a typical range.
          </p>
          <p className="text-xs font-semibold text-primary mt-3">Tips To Adhere To:</p>
          <ul className="text-xs text-foreground/80 space-y-1 mt-1 list-disc list-inside">
            <li>Low sleep nights → higher cramp scores</li>
            <li>Low hydration → increased bloating</li>
          </ul>
        </div>

        {/* Period Length chart */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold">Period Length</h2>
          <p className="text-xs text-muted-foreground">Monthly period pattern (0–7 days) and flow intensity</p>
          <div className="mt-3"><LineChart /></div>
          <p className="text-[10px] text-muted-foreground mt-2">↑ Higher peaks indicate stronger symptoms. Plateaus (yellow lines) show heavier days.</p>
        </div>

        {/* Symptom Frequency */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
          <h2 className="font-semibold">Symptom Frequency</h2>
          <p className="text-xs text-muted-foreground">Study your body system & understand your wellbeing</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Donut value={55} label="Physical Pain" color="oklch(0.65 0.22 0)" />
            <Donut value={75} label="Mood & Mental" color="oklch(0.6 0.22 320)" />
            <Donut value={82} label="Digestion & Appetite" color="oklch(0.7 0.18 140)" />
            <Donut value={33} label="Sexual Health" color="oklch(0.7 0.22 30)" />
            <Donut value={22} label="Digestion & Appetite" color="oklch(0.7 0.22 60)" />
            <Donut value={60} label="Sleep" color="oklch(0.6 0.22 270)" />
          </div>
        </div>
      </div>

      {/* Historical Cycle Data */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-border/50">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold">Historical Cycle Data</h2>
            <button className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
              Oct 2025 <ChevronDown className="size-3" />
            </button>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold">
            <Download className="size-3.5" /> Download PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Top Symptom</th>
                <th className="py-2 font-medium text-right">Total Symptoms</th>
                <th className="py-2 font-medium text-right">Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3">
                    <div className="font-medium">{r.date}</div>
                    <div className="text-[10px] text-muted-foreground">{r.time}</div>
                  </td>
                  <td className="py-3">{r.symptom}</td>
                  <td className="py-3 text-right">{r.total}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1">
                      {r.note} <FileText className="size-3 text-muted-foreground" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
