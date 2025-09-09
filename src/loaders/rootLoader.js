import { getCurrentUser } from "../api/auth.api";

export async function rootLoader({ request } = {}) {
  // Si le serveur redirige avec ?clearRegister=1, on supprime la clé en session
  try {
    const url = request ? new URL(request.url) : null;
    const clear = url ? url.searchParams.get("clearRegister") : null;
    if (clear === "1") {
      try {
        sessionStorage.removeItem("register_expiresAt");
      } catch {
        void 0;
      }
    }
  } catch {
    void 0;
  }

  return getCurrentUser();
}
