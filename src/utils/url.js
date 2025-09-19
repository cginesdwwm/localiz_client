// Build a safe BASE_URL for API calls.
// - Prefer the Vite env `VITE_SERVER_URL` when provided (e.g. http://localhost:5000)
// - Fall back to localhost:5000 in development
// - Always append the `/api` prefix used by the server and strip duplicate slashes
const RAW = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
export const BASE_URL = RAW.replace(/\/+$/, "") + "/api";
