import { toast } from "react-hot-toast";
import React from "react";
import Button from "../components/Common/Button";
import confirmModal from "../lib/confirmModal";

const DEFAULT = {
  position: "top-center",
  duration: 6000,
};

const merge = (opts = {}) => ({ ...DEFAULT, ...opts });

// Carte de déduplication simple pour éviter d'afficher plusieurs fois les mêmes messages de succès.
const recentSuccess = new Map();
const DEDUPE_MS = 3000;

// Affiche une boîte de dialogue de confirmation à l'intérieur d'un toast et résout un booléen
export function confirm(message, opts = {}) {
  return new Promise((resolve) => {
    // Use React.createElement to avoid JSX in a .js file
    const content = (t) =>
      React.createElement(
        "div",
        { className: "p-2" },
        React.createElement(
          "div",
          { className: "mb-3 text-sm text-white" },
          message
        ),
        React.createElement(
          "div",
          { className: "flex justify-end gap-2" },
          React.createElement(
            Button,
            {
              variant: "ghost",
              onClick: () => {
                toast.dismiss(t.id);
                resolve(false);
              },
            },
            "Annuler"
          ),
          React.createElement(
            Button,
            {
              variant: "danger",
              onClick: () => {
                toast.dismiss(t.id);
                resolve(true);
              },
            },
            "Confirmer"
          )
        )
      );

    toast(content, merge({ duration: 60000, ...opts }));
  });
}

export const notify = {
  success: (msg, opts = {}) => {
    try {
      const key = String(msg);
      const now = Date.now();
      const last = recentSuccess.get(key) || 0;
      if (now - last < DEDUPE_MS) return null;
      recentSuccess.set(key, now);
      setTimeout(() => recentSuccess.delete(key), DEDUPE_MS + 50);
    } catch {
      // ignore storage errors
    }
    return toast.success(msg, merge(opts));
  },
  error: (msg, opts = {}) => toast.error(msg, merge(opts)),
  info: (msg, opts = {}) => toast(msg, merge(opts)),
  custom: (fn, opts = {}) => toast((t) => fn(t), merge(opts)),
};

// Keep the old toast-based confirm available, but prefer a modal confirm for accessibility.
notify.toastConfirm = confirm;
notify.confirm = async (message, opts = {}) => {
  // If opts.forceToast is true, use the old toast confirm; otherwise use modal
  if (opts && opts.forceToast) return notify.toastConfirm(message, opts);
  return await confirmModal(message, opts);
};
