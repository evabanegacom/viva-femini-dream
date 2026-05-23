import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTipsForCycleDay(day: number) {
  if (day <= 5) return [
    { icon: "🍵", title: "Stay Comfortable",  body: "On heavy flow days, prioritize comfort. Stay hydrated and use heating pads for relief.", bg: "bg-[oklch(0.94_0.05_350)]", note: "Listen to your body" },
    { icon: "💧", title: "Stay Hydrated",      body: "Drink 2L of water daily to ease cramps and support your health.", bg: "bg-[oklch(0.94_0.05_175)]", note: "8 glasses/day" },
    { icon: "🧘", title: "Gentle Movement",    body: "Light stretching or yoga can ease discomfort and lift mood.", bg: "bg-[oklch(0.94_0.05_60)]",  note: "Listen to your body" },
  ];
  if (day <= 13) return [
    { icon: "⚡", title: "High Energy Phase",  body: "Your energy is rising. Great time for cardio and strength training.", bg: "bg-[oklch(0.94_0.05_60)]",  note: "Push your limits" },
    { icon: "🥗", title: "Eat Light & Fresh",  body: "Focus on iron-rich foods to replenish after your period.", bg: "bg-[oklch(0.94_0.05_175)]", note: "Nourish yourself" },
    { icon: "🌞", title: "Social & Productive",body: "You may feel more social and focused. Use this energy wisely.", bg: "bg-[oklch(0.94_0.05_220)]", note: "You've got this" },
  ];
  if (day <= 17) return [
    { icon: "🌸", title: "Ovulation Phase",    body: "You're at peak fertility. Energy and confidence are high.", bg: "bg-[oklch(0.94_0.05_350)]", note: "Peak vitality" },
    { icon: "💪", title: "Strength Training",  body: "Leverage high estrogen for best workout performance.", bg: "bg-[oklch(0.94_0.05_60)]",  note: "Go for it" },
    { icon: "💧", title: "Stay Hydrated",      body: "Drink plenty of water to support your body during ovulation.", bg: "bg-[oklch(0.94_0.05_175)]", note: "8 glasses/day" },
  ];
  return [
    { icon: "🧘", title: "Wind Down",          body: "Your body is preparing for the next cycle. Rest and recover.", bg: "bg-[oklch(0.94_0.05_60)]",  note: "Rest is productive" },
    { icon: "🍫", title: "Manage Cravings",    body: "PMS cravings are real. Opt for dark chocolate and complex carbs.", bg: "bg-[oklch(0.94_0.05_350)]", note: "Be kind to yourself" },
    { icon: "😴", title: "Prioritise Sleep",   body: "Aim for 8 hours. Progesterone dips can disrupt sleep.", bg: "bg-[oklch(0.94_0.05_220)]", note: "Sleep heals" },
  ];
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

