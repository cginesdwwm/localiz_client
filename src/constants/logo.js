// Configuration centralisée de l'URL du logo avec repli local côté client.
// Priorité (de la plus forte à la plus faible) : variable d'env Vite VITE_PUBLIC_LOGO_URL -> URL publique Supabase codée en dur -> ressource locale embarquée.
import localLogo from "../assets/images/logo.webp";

const FALLBACK_SUPABASE_LOGO =
  "https://pjrrvzxomdowrraykone.supabase.co/storage/v1/object/public/public-assets/logo.webp";

// Vite expose les variables d'environnement via import.meta.env
const envLogo =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_PUBLIC_LOGO_URL
    : undefined;

export const SUPABASE_LOGO = envLogo || FALLBACK_SUPABASE_LOGO;

export { localLogo };

export default SUPABASE_LOGO;
