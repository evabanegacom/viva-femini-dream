import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TIP_GRADIENTS = [
  "linear-gradient(139.97deg, rgba(255, 171, 201, 0.22) 0.52%, #FFFFFF 99.48%), #FFABC9",
  "linear-gradient(139.97deg, rgba(255, 193, 114, 0.22) 0.52%, #FFFFFF 99.48%), #FFC172",
  "linear-gradient(139.97deg, rgba(113, 253, 253, 0.22) 0.52%, #FFFFFF 99.48%), #71FDFD",
];

function getGradientForIndex(index: number): string {
  return TIP_GRADIENTS[index % TIP_GRADIENTS.length];
}

export function getTipsForCycleDay(day: number) {
  let baseTips: Array<{
    icon: string;
    title: string;
    body: string;
    note: string;
  }>;

  if (day <= 5) {
    baseTips = [
      { icon: "🥗", title: "Stay Comfortable", body: "On heavy flow days, prioritize comfort. Stay hydrated and use heating pads for relief.", note: "Listen to your body" },
      { icon: "🧘‍♀️", title: "Stay Hydrated", body: "Drink 2L of water daily to ease cramps and support your health.", note: "8 glasses/day" },
      { icon: "🥗", title: "Gentle Movement", body: "Light stretching or yoga can ease discomfort and lift mood.", note: "Listen to your body" },
    ];
  } else if (day <= 13) {
    baseTips = [
      { icon: "🧘‍♀️", title: "High Energy Phase", body: "Your energy is rising. Great time for cardio and strength training.", note: "Push your limits" },
      { icon: "🥗", title: "Eat Light & Fresh", body: "Focus on iron-rich foods to replenish after your period.", note: "Nourish yourself" },
      { icon: "🧘‍♀️", title: "Social & Productive", body: "You may feel more social and focused. Use this energy wisely.", note: "You've got this" },
    ];
  } else if (day <= 17) {
    baseTips = [
      { icon: "🥗", title: "Ovulation Phase", body: "You're at peak fertility. Energy and confidence are high.", note: "Peak vitality" },
      { icon: "🧘‍♀️", title: "Strength Training", body: "Leverage high estrogen for best workout performance.", note: "Go for it" },
      { icon: "🥗", title: "Stay Hydrated", body: "Drink plenty of water to support your body during ovulation.", note: "8 glasses/day" },
    ];
  } else {
    baseTips = [
      { icon: "🧘", title: "Wind Down", body: "Your body is preparing for the next cycle. Rest and recover.", note: "Rest is productive" },
      { icon: "🧘‍♀️", title: "Manage Cravings", body: "PMS cravings are real. Opt for dark chocolate and complex carbs.", note: "Be kind to yourself" },
      { icon: "🥗", title: "Prioritise Sleep", body: "Aim for 8 hours. Progesterone dips can disrupt sleep.", note: "Sleep heals" },
    ];
  }

  // Apply gradients using inline style (this works reliably)
  return baseTips.map((tip, index) => ({
    ...tip,
    bg: getGradientForIndex(index),   // ← Now returns the gradient string
  }));
}

export function daysBetween(from: string, to: string) {
  return Math.ceil(
    (new Date(to + "T00:00:00").getTime() - new Date(from + "T00:00:00").getTime()) / 86400000,
  );
}

export function parseLocalDate(iso: string): Date {
  return new Date(iso + "T00:00:00");
}

export function daysInMonth(
  startISO: string,
  endISO: string,
  calYear: number,
  calMonth: number,
): Set<number> {
  const days = new Set<number>();
  const start = parseLocalDate(startISO);
  const end   = parseLocalDate(endISO);
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      days.add(d.getDate());
    }
  }
  return days;
}


// src/lib/download-report.ts
// Generates and downloads a PDF of the Health Report using the browser's
// built-in print dialog — no external PDF library needed.

interface DownloadReportParams {
  cycleSummary: {
    label: string;
    cycleLength: number;
    periodDuration: number;
    estimatedNextPeriod: string | null;
    ovulationWindow: string | null;
  };
  flowSummary: {
    narrative: string;
    tips: string[];
  };
  historicalRows: Array<{
    dateLabel: string;
    timeLabel: string;
    topSymptom: string;
    totalSymptomsScore: string;
    note: string | null;
  }>;
}

export function downloadHealthReport({
  cycleSummary,
  flowSummary,
  historicalRows,
}: DownloadReportParams) {
  // Build a self-contained HTML document styled for print
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>VívaFemme Health Report — ${cycleSummary.label}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 13px;
          color: #0f172a;
          padding: 40px 48px;
          line-height: 1.5;
        }

        /* ── Header ── */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #FB3179;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .header h1 {
          font-size: 22px;
          font-weight: 700;
          color: #FB3179;
        }
        .header .meta {
          font-size: 11px;
          color: #6b7280;
          text-align: right;
        }

        /* ── Section ── */
        .section {
          margin-bottom: 28px;
        }
        .section h2 {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
          padding-bottom: 4px;
          border-bottom: 1px solid #f1f5f9;
        }

        /* ── Summary pills ── */
        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid;
        }
        .pill-orange  { background: #F36F561A; color: #F36F56; border-color: #F36F56; }
        .pill-pink    { background: #FB31791A; color: #FB3179; border-color: #FB3179; }
        .pill-purple  { background: #7E19DF1A; color: #7E19DF; border-color: #7E19DF; }
        .pill-blue    { background: #0D34F91A; color: #0D34F9; border-color: #0D34F9; }

        /* ── Narrative ── */
        .narrative {
          font-size: 12px;
          color: #374151;
          line-height: 1.7;
          margin-bottom: 10px;
        }
        .tips-title {
          font-size: 12px;
          font-weight: 600;
          color: #FB3179;
          margin-bottom: 6px;
        }
        .tips-list {
          padding-left: 18px;
          font-size: 12px;
          color: #374151;
        }
        .tips-list li { margin-bottom: 3px; }

        /* ── Table ── */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        thead tr {
          background: #fdf2f8;
        }
        th {
          text-align: left;
          padding: 8px 10px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #f1e6f0;
        }
        th.right { text-align: right; }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #fce7f3;
          vertical-align: top;
        }
        td.right { text-align: right; }
        .date-label { font-weight: 500; }
        .time-label { font-size: 10px; color: #9ca3af; }
        tr:last-child td { border-bottom: none; }

        /* ── Footer ── */
        .footer {
          margin-top: 32px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          font-size: 10px;
          color: #9ca3af;
          display: flex;
          justify-content: space-between;
        }

        /* ── Print settings ── */
        @media print {
          body { padding: 20px 28px; }
          @page { margin: 16mm; size: A4; }
        }
      </style>
    </head>
    <body>

      <!-- Header -->
      <div class="header">
        <div>
          <h1>🌸 VívaFemme</h1>
          <p style="font-size:13px; color:#6b7280; margin-top:2px;">
            Health Report — ${cycleSummary.label}
          </p>
        </div>
        <div class="meta">
          Generated: ${new Date().toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}<br/>
          Confidential · For personal use only
        </div>
      </div>

      <!-- Cycle Summary -->
      <div class="section">
        <h2>Cycle Summary</h2>
        <div class="pills">
          <span class="pill pill-orange">🌸 Cycle Length: <strong>${cycleSummary.cycleLength} Days</strong></span>
          <span class="pill pill-pink">💧 Period Duration: <strong>${cycleSummary.periodDuration} Days</strong></span>
          <span class="pill pill-purple">📅 Estimated Next Period: <strong>${cycleSummary.estimatedNextPeriod ?? "—"}</strong></span>
          <span class="pill pill-blue">🔵 Ovulation Window: <strong>${cycleSummary.ovulationWindow ?? "—"}</strong></span>
        </div>
      </div>

      <!-- Flow & Symptoms Summary -->
      <div class="section">
        <h2>Flow &amp; Symptom Summary</h2>
        <p class="narrative">${flowSummary?.narrative ?? ""}</p>
        ${flowSummary?.tips?.length ? `
          <p class="tips-title">Tips To Adhere To:</p>
          <ul class="tips-list">
            ${flowSummary.tips.map((t) => `<li>${t}</li>`).join("")}
          </ul>
        ` : ""}
      </div>

      <!-- Historical Cycle Data -->
      <div class="section">
        <h2>Historical Cycle Data</h2>
        ${historicalRows.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th style="width:28%">Date</th>
                <th style="width:30%">Top Symptom</th>
                <th class="right" style="width:20%">Total</th>
                <th class="right" style="width:22%">Note</th>
              </tr>
            </thead>
            <tbody>
              ${historicalRows.map((row) => `
                <tr>
                  <td>
                    <div class="date-label">${row.dateLabel ?? ""}</div>
                    <div class="time-label">${row.timeLabel ?? ""}</div>
                  </td>
                  <td>${row.topSymptom ?? "—"}</td>
                  <td class="right">${row.totalSymptomsScore ?? "—"}</td>
                  <td class="right">${row.note ?? "—"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : `<p style="color:#9ca3af; font-size:12px; font-style:italic;">No records found.</p>`}
      </div>

      <!-- Footer -->
      <div class="footer">
        <span>VívaFemme · Menstrual Health Tracking</span>
        <span>${cycleSummary.label} · ${historicalRows.length} days logged</span>
      </div>

    </body>
    </html>
  `;

  // Open in a hidden iframe and trigger print-to-PDF
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed; width:0; height:0; border:none; opacity:0;";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(html);
  doc.close();

  // Small delay lets the iframe finish rendering before print dialog opens
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    // Clean up iframe after print dialog closes
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 300);
}