import { apiFetch } from "@/lib/api/client";

export interface CreateSymptomLogPayload {
  userId: string;
  cycleId: string;
  date: string;
  physicalSymptoms?: string[];
  moodSymptoms?: string[];
  periodIndicators?: string[];
  sexualHealthSymptoms?: string[];
  flowIntensity?: number;
  notes?: string;
}

export async function createSymptomLog(payload: CreateSymptomLogPayload) {
  return apiFetch("/symptoms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getSymptomsByUser(userId: string) {
  return apiFetch(`/symptoms?userId=${userId}`);
}