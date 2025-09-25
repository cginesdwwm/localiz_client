import { useEffect } from "react";

/**
 * useFocusHeading
 *
 * Déplace le focus vers le titre référencé au montage / quand les deps changent.
 * Garantit que l'élément est focusable par script sans modifier l'ordre de tabulation.
 *
 * @param {React.RefObject<HTMLElement>} ref - ref vers l'élément de titre
 * @param {{ delay?: number }} options - délai optionnel avant de donner le focus
 */

export default function useFocusHeading(ref, options = {}) {
  const { delay = 0, preventScroll = true } = options;
  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const hadTabIndex = node.hasAttribute("tabindex");
    if (!hadTabIndex) node.setAttribute("tabindex", "-1");

    const t = setTimeout(() => {
      if (typeof node.focus === "function") {
        // Évite de faire défiler la page lors d'un focus programmatique
        try {
          node.focus({ preventScroll });
        } catch {
          node.focus();
        }
      }
    }, delay);

    return () => {
      clearTimeout(t);
      if (!hadTabIndex) node.removeAttribute("tabindex");
    };
  }, [ref, delay, preventScroll]);
}
