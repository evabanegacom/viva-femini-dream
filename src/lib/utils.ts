import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TIP_GRADIENTS = [
  "linear-gradient(139.97deg, rgba(255, 171, 201, 0.22) 0.52%, #FFFFFF 99.48%)",
  "linear-gradient(139.97deg, rgba(255, 193, 114, 0.22) 0.52%, #FFFFFF 99.48%)",
  "linear-gradient(139.97deg, rgba(113, 253, 253, 0.22) 0.52%, #FFFFFF 99.48%)",
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

