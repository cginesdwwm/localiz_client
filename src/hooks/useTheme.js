import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../constants";

// Simple hook that centralizes reading/writing theme to localStorage
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
