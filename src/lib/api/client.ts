import type { ApiError } from "@/types/health-report-types";

const DEFAULT_API_BASE_URL = "https://viva-femini-backend-pmcw.onrender.com/api/v1";
// const DEFAULT_API_BASE_URL = "http://localhost:3000/api/v1";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || DEFAULT_API_BASE_URL;

export function toApiError(error: unknown, fallback = "Unexpected error"): ApiError {
  if (typeof error === "object" && error !== null && "message" in error) {
    const maybeError = error as { message?: unknown; status?: unknown };
    return {
      message: typeof maybeError.message === "string" ? maybeError.message : fallback,
      status: typeof maybeError.status === "number" ? maybeError.status : undefined,
    };
  }

  return { message: fallback };
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);

  if (!res.ok) {
    throw {
      message: `Request failed: ${res.status} ${res.statusText}`,
      status: res.status,
    } as ApiError;
  }

  return (await res.json()) as T;
}
