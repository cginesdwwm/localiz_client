import { useEffect } from "react";

/**
 * useDocumentTitle
 *
 * Lightweight hook to set `document.title` from within a page/component.
 * - App-wide, `App.jsx` already syncs the title from the first page heading
 *   after navigation to support the route-change live announcer.
 * - Use this hook when a page needs a title that differs from its heading,
 *   or to set the title earlier than `App.jsx`'s post-navigation sync.
 * - Avoid double-setting: prefer one source of truth (either this hook or the
 *   heading-driven sync in `App.jsx`) for a given route.
 *
 * Params:
 * - title: base title text to set
 * - options.suffix: string appended to the title (default " | Localiz")
 * - options.replace: force set even if identical (default false)
 */

export default function useDocumentTitle(title, options = {}) {
  const { suffix = " | Localiz", replace = false } = options;
  useEffect(() => {
    if (!title) return;
    const next = `${title}${suffix || ""}`;
    const prev = document.title;
    if (replace || prev !== next) {
      document.title = next;
    }
  }, [title, suffix, replace]);
}
