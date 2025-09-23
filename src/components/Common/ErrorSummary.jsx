import { useEffect, useRef } from "react";

/**
 * ErrorSummary
 *
 * Accessible, focusable summary of form validation errors.
 * - Displays a concise list of invalid fields with their messages
 * - Moves focus to the summary so screen reader users hear it immediately
 * - Each item is a button that focuses the corresponding field by element id
 *
 * Connections in the app:
 * - Works with react-hook-form's `formState.errors`
 * - Pairs with Input fields that set a stable `id` so focus targeting works
 * - Complements per-field error messages (role="alert") already provided by `Input`
 *
 * Props:
 * - errors: react-hook-form `errors` object
 * - fields: array of { name, id, label } describing fields to include
 * - title: optional heading text for the summary
 * - autoFocus: when true, focuses the summary when errors appear
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
      // Delay to ensure the element is mounted before moving focus
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
                  // Move focus to the field so users jump straight to fix it
                  el.focus({ preventScroll: false });
                }
              }}
            >
              {f.label}: {errors[f.name]?.message || "Champ invalide"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
