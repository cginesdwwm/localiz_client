// PAGE THEME

import { useAuth } from "../../context/AuthContext";
import { saveMyTheme } from "../../api/user.api";
import { notify } from "../../utils/notify";
import useTheme from "../../hooks/useTheme";
import BackLink from "../../components/Common/BackLink";
import Checkbox from "../../components/Common/Checkbox";

const THEMES = [
  { id: "dark", label: "Sombre (par défaut)" },
  { id: "light", label: "Clair" },
];

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
    <div className="p-4 mx-auto max-w-xl mt-10">
      <BackLink to="/settings" fixed />

      <div className="p-12">
        <h1
          className="text-3xl font-bold font-quicksand mt-6 mb-4"
          style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
        >
          Thème
        </h1>

        <h2 className="text-2xl font-semibold font-quicksand mt-2 mb-4">
          Sélectionne le thème de ton choix
        </h2>

        <div className="">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setAndPersist(t.id)}
              className="w-full flex items-center justify-between p-3 border-t border-white first:border-t-0"
              aria-pressed={theme === t.id}
            >
              <span className="font-quicksand !font-bold text-[16px] text-left">
                {t.label}
              </span>
              <Checkbox
                checked={theme === t.id}
                onChange={() => setAndPersist(t.id)}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
