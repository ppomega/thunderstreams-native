import { API_URL } from './config';
import type { Season, Series } from './types';

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as T;
}

export async function fetchAssets(signal?: AbortSignal): Promise<Series[]> {
  const data = await getJson<unknown>(`${API_URL}/assets`, signal);
  return Array.isArray(data) ? (data as Series[]) : [];
}

// Same normalisation the web app applies before calling /animeInfo
function animeKey(name: string) {
  return name.replaceAll(' ', '_').replaceAll('-', '_').replaceAll(':', '_');
}

const seasonCache = new Map<string, Season[]>();

export async function fetchSeasons(name: string, signal?: AbortSignal): Promise<Season[]> {
  const key = animeKey(name);
  const cached = seasonCache.get(key);
  if (cached) return cached;
  const data = await getJson<unknown>(`${API_URL}/animeInfo?name=${key}`, signal);
  const seasons = Array.isArray(data) ? (data as Season[]) : [];
  seasonCache.set(key, seasons);
  return seasons;
}

export function ratingOf(s: Series): string | null {
  const r = s.rating;
  if (r == null) return null;
  if (typeof r === 'object') return r.$numberDecimal ?? null;
  return String(r);
}
