// src/queries/tracking.ts
import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Matches GET /api/v1/tracking/symptom-categories response.
 * The backend wraps everything in { success, data, timestamp } —
 * apiFetch returns the full envelope, so we unwrap .data below.
 */
interface SymptomCategoriesResponse {
  success:   boolean;
  timestamp: string;
  data: {
    physicalPain:     string[];
    moodMental:       string[];
    periodIndicators: string[];
    sexualHealth:     string[];
  };
}

export interface SymptomCategories {
  physicalPain:     string[];
  moodMental:       string[];
  periodIndicators: string[];
  sexualHealth:     string[];
}

// ── Query ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/tracking/symptom-categories
 *
 * Fetches the four pill-button lists for the Tracking screen.
 * staleTime: Infinity — these never change mid-session, cache forever.
 */
export function trackingCategoriesQueryOptions() {
  return queryOptions<SymptomCategories>({
    queryKey: ["tracking", "symptom-categories"],
    queryFn: async () => {
      const res = await apiFetch<SymptomCategoriesResponse>(
        "/tracking/symptom-categories",
      );
      // Unwrap the { success, data, timestamp } envelope
      return res.data;
    },
    staleTime: Infinity,
    gcTime:    Infinity,
  });
}