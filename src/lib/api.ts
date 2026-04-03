/** Base URL for the Nest API (no trailing slash). Set `VITE_API_URL` in `.env`. */
export function getApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3001";
}

export const API_URL = getApiUrl();
