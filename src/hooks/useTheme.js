import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../constants";

// Simple hook that centralizes reading/writing theme to localStorage
// Note for maintainers: an inline pre-hydration script in `client/index.html`
// applies the initial `.theme-light` class (from localStorage or
// prefers-color-scheme) before CSS/JS loads to avoid a flash-of-incorrect-theme.
// Keep the script and this hook's behavior in sync if you change STORAGE_KEY.
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
