// PAGE THEME

import { useAuth } from "../../context/AuthContext";
import { saveMyTheme } from "../../api/user.api";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import useTheme from "../../hooks/useTheme";

export default function Theme() {
  const [theme, setTheme] = useTheme();
  const { isAuthenticated } = useAuth();

  const setAndPersist = async (next) => {
    setTheme(next);
    if (!isAuthenticated) return;
    try {
      await saveMyTheme(next);
    } catch (err) {
      console.warn("Failed to save theme on server:", err);
      notify.error(err?.message || "Impossible de sauvegarder le thème");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="title text-2xl">Apparence</h2>
      <p className="type-base">
        Choisis le thème de l'application. Le thème sombre est le thème par
        défaut.
      </p>

      <div className="flex items-center gap-3 mt-4">
        <Button
          type="button"
          variant={theme === "dark" ? "cta" : "ghost"}
          aria-pressed={theme === "dark"}
          onClick={() => setAndPersist("dark")}
        >
          Sombre (par défaut)
        </Button>

        <Button
          type="button"
          variant={theme === "light" ? "cta" : "ghost"}
          aria-pressed={theme === "light"}
          onClick={() => setAndPersist("light")}
        >
          Clair
        </Button>
      </div>
    </div>
  );
}
