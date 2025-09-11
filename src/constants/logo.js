// Centralized logo URL configuration and local fallback for the client.
// Priority (most to least): Vite env var VITE_PUBLIC_LOGO_URL -> hardcoded Supabase public URL -> local bundled asset.
import localLogo from "../assets/images/logo.png";

const FALLBACK_SUPABASE_LOGO =
  "https://pjrrvzxomdowrraykone.supabase.co/storage/v1/object/public/public-assets/logo.png";

// Vite exposes env vars via import.meta.env
const envLogo =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_PUBLIC_LOGO_URL
    : undefined;

export const SUPABASE_LOGO = envLogo || FALLBACK_SUPABASE_LOGO;

export { localLogo };

export default SUPABASE_LOGO;
