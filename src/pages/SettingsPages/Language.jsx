// PAGE LANGUE

import { useEffect, useState } from "react";
import BackLink from "../../components/Common/BackLink";
import Checkbox from "../../components/Common/Checkbox";

const LANGUAGES = [
  { id: "fr", label: "Français" },
  { id: "en", label: "English" },
  { id: "nl", label: "Nederlands" },
  { id: "de", label: "Deutsch" },
  { id: "it", label: "Italiano" },
];

export default function Language() {
  const STORAGE_KEY = "localiz:language";
  const [selected, setSelected] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v || "fr";
    } catch {
      return "fr";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, selected);
    } catch {
      // ignore storage errors
    }
  }, [selected]);

  return (
    <div className="p-4 mx-auto max-w-xl mt-10">
      <BackLink to="/settings" fixed />

      <h1
        className="text-3xl font-quicksand !font-bold mt-6 mb-4"
        style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
      >
        Langue
      </h1>

      <h2 className="text-2xl font-semibold font-quicksand mt-2 mb-4">
        Sélectionne la langue de ton choix
      </h2>

      <div className="">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelected(lang.id)}
            className="w-full flex items-center justify-between p-3 border-t border-white first:border-t-0"
            aria-pressed={selected === lang.id}
          >
            <span className="font-quicksand !font-bold text-[16px] text-left">
              {lang.label}
            </span>
            <Checkbox
              checked={selected === lang.id}
              onChange={() => setSelected(lang.id)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
