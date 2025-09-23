// PAGE LANGUE

import { useEffect, useRef, useState } from "react";
import BackLink from "../../components/Common/BackLink";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

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

  const headingRef = useRef(null);
  useDocumentTitle("Langue");
  useFocusHeading(headingRef);

  return (
    <main className="p-4 mx-auto max-w-xl mt-10" role="main">
      <BackLink to="/settings" fixed />

      <h1
        className="text-3xl font-quicksand !font-bold mt-6 mb-4"
        style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
        ref={headingRef}
      >
        Langue
      </h1>

      <h2
        id="language-desc"
        className="text-2xl font-semibold font-quicksand mt-2 mb-4"
      >
        Sélectionne la langue de ton choix
      </h2>

      <fieldset aria-describedby="language-desc">
        <legend className="sr-only">Sélection de la langue</legend>
        {LANGUAGES.map((lang) => {
          const checked = selected === lang.id;
          const inputId = `language-${lang.id}`;
          return (
            <label
              key={lang.id}
              htmlFor={inputId}
              className="w-full flex items-center justify-between p-3 border-t border-white first:border-t-0 cursor-pointer"
            >
              <input
                id={inputId}
                type="radio"
                name="language"
                value={lang.id}
                checked={checked}
                onChange={() => setSelected(lang.id)}
                className="sr-only"
              />
              <span className="font-quicksand !font-bold text-[16px] text-left">
                {lang.label}
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
    </main>
  );
}
