import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../constants";

// Hook simple qui centralise la lecture/écriture du thème dans localStorage
// Note pour les mainteneurs : un script inline de pré-hydratation dans `client/index.html`
// applique la classe initiale `.theme-light` (depuis localStorage ou
// prefers-color-scheme) avant le chargement du CSS/JS pour éviter un flash de mauvais thème.
// Garder le script et le comportement de ce hook synchronisés si vous changez STORAGE_KEY.
export default function useTheme(initial) {
  const [theme, setTheme] = useState(() => {
    if (initial) return initial;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.classList.add("theme-light");
    else root.classList.remove("theme-light");

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  return [theme, setTheme];
}
