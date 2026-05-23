import { apiFetch } from "@/lib/api/client";

export interface Cycle {
  _id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  cycleLength?: number;
  periodLength?: number;
  label?: string;
  notes?: string;
  ovulationStartDate?: string;
  ovulationEndDate?: string;
  estimatedNextPeriod?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCycles(userId: string): Promise<Cycle[]> {
  const data = await apiFetch<{ data: Cycle[] }>(`/cycles?userId=${userId}`);
  return data.data;
}