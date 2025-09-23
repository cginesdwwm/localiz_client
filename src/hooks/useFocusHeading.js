import { useEffect } from "react";

/**
 * useFocusHeading
 *
 * Moves focus to the referenced heading on mount/when deps change.
 * Ensures the element is programmatically focusable without altering tab order.
 *
 * @param {React.RefObject<HTMLElement>} ref - ref to heading element
 * @param {{ delay?: number }} options - optional delay before focusing
 */

export default function useFocusHeading(ref, options = {}) {
  const { delay = 0 } = options;
  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const hadTabIndex = node.hasAttribute("tabindex");
    if (!hadTabIndex) node.setAttribute("tabindex", "-1");

    const t = setTimeout(() => {
      if (typeof node.focus === "function") {
        node.focus();
      }
    }, delay);

    return () => {
      clearTimeout(t);
      if (!hadTabIndex) node.removeAttribute("tabindex");
    };
  }, [ref, delay]);
}
