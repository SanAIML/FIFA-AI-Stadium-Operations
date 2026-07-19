import type {
  BackendDashboardResponse,
  BackendIncident,
  BackendOperationalMemory,
  BackendRecommendation,
} from '@/types/api';

export const BACKEND_URL = 'http://localhost:8080';
const API_BASE = `${BACKEND_URL}/api`;

class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new ApiError(`Request failed: ${response.statusText}`, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Network error');
  } finally {
    clearTimeout(timeout);
  }
}

export async function getDashboard(): Promise<BackendDashboardResponse> {
  return fetchJson<BackendDashboardResponse>('/dashboard');
}

export async function getIncidents(): Promise<BackendIncident[]> {
  return fetchJson<BackendIncident[]>('/incidents');
}

export async function getRecommendations(): Promise<BackendRecommendation[]> {
  return fetchJson<BackendRecommendation[]>('/recommendations');
}

export async function getMemory(): Promise<BackendOperationalMemory[]> {
  return fetchJson<BackendOperationalMemory[]>('/memory');
}

export { ApiError };
