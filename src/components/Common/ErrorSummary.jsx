import { useEffect, useRef } from "react";

/**
 * Récapitulatif accessible et focalisable des erreurs de validation de formulaire.
 * - Affiche une liste concise des champs invalides avec leurs messages
 * - Déplace le focus sur le récapitulatif pour que les lecteurs d'écran l'annoncent immédiatement
 * - Chaque élément est un bouton qui place le focus sur le champ correspondant via son id
 *
 * Intégration dans l'application :
 * - Fonctionne avec `formState.errors` de react-hook-form
 * - À utiliser avec des champs `Input` qui possèdent un `id` stable (ciblage du focus)
 * - Complète les messages d'erreur par champ (role="alert") déjà gérés par `Input`
 *
 * Props :
 * - errors : objet `errors` de react-hook-form
 * - fields : tableau { name, id, label } décrivant les champs à inclure
 * - title : texte du titre du récapitulatif (optionnel)
 * - autoFocus : si true, place le focus sur le récapitulatif quand des erreurs apparaissent
 */

// fields: [{ name, id, label }]
export default function ErrorSummary({
  errors,
  fields,
  title = "Corrigez les erreurs suivantes :",
  autoFocus = true,
}) {
  const containerRef = useRef(null);

  const items = (fields || []).filter((f) => !!errors?.[f.name]);
  const hasErrors = items.length > 0;

  useEffect(() => {
    if (!autoFocus) return;
    if (hasErrors) {
      // Laisse un petit délai pour s'assurer que l'élément est monté avant le focus
      const t = setTimeout(() => {
        containerRef.current?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [hasErrors, autoFocus]);

  if (!hasErrors) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      className="mb-4 border border-red-300 bg-red-50 text-red-800 rounded p-3"
    >
      <p className="font-semibold mb-2">{title}</p>
      <ul className="list-disc ml-5">
        {items.map((f) => (
          <li key={f.name} className="mb-1">
            <button
              type="button"
              className="underline"
              onClick={() => {
                const el = document.getElementById(f.id);
                if (el) {
                  // Déplace le focus sur le champ pour aller directement à corriger
                  el.focus({ preventScroll: false });
                }
              }}
            >
              {errors[f.name]?.message || "Champ invalide"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
