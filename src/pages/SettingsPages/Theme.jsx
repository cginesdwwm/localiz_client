// PAGE THEME

import { useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { saveMyTheme } from "../../api/user.api";
import { notify } from "../../utils/notify";
import useTheme from "../../hooks/useTheme";
import BackLink from "../../components/Common/BackLink";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

const THEMES = [
  { id: "dark", label: "Sombre (par défaut)" },
  { id: "light", label: "Clair" },
];

export default function Theme() {
  const [theme, setTheme] = useTheme();
  const { isAuthenticated } = useAuth();
  const headingRef = useRef(null);

  useDocumentTitle("Thème");
  useFocusHeading(headingRef);

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
    <main className="p-4 mx-auto max-w-xl mt-10" role="main">
      <BackLink to="/settings" fixed />

      <div className="p-12">
        <h1
          className="text-3xl font-bold font-quicksand mt-6 mb-4"
          style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
          ref={headingRef}
        >
          Thème
        </h1>

        <h2
          id="theme-desc"
          className="text-2xl font-semibold font-quicksand mt-2 mb-4"
        >
          Sélectionne le thème de ton choix
        </h2>

        <fieldset aria-describedby="theme-desc">
          <legend className="sr-only">Sélection du thème</legend>
          {THEMES.map((t) => {
            const checked = theme === t.id;
            const inputId = `theme-${t.id}`;
            return (
              <label
                key={t.id}
                htmlFor={inputId}
                className="w-full flex items-center justify-between p-3 border-t border-white first:border-t-0 cursor-pointer"
              >
                <input
                  id={inputId}
                  type="radio"
                  name="theme"
                  value={t.id}
                  checked={checked}
                  onChange={() => setAndPersist(t.id)}
                  className="sr-only"
                />
                <span className="font-quicksand !font-bold text-[16px] text-left">
                  {t.label}
                </span>
                <span
                  aria-hidden
                  className="w-5 h-5 flex items-center justify-center"
                >
                  {checked ? "✓" : ""}
                </span>
              </label>
            );
          })}
        </fieldset>
      </div>
    </main>
  );
}
