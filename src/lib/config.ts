export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

/** Image/file served by the backend: GET /file?name=<name> */
export function fileUrl(name?: string | null): string | undefined {
  if (!name) return undefined;
  if (/^https?:\/\//i.test(name)) return name;
  return `${API_URL}/file?name=${encodeURIComponent(name)}`;
}

/** DASH manifest for an episode: GET /<episode.path>output.mpd */
export function manifestUrl(path: string): string {
  return `${API_URL}/${path}output.mpd`;
}
