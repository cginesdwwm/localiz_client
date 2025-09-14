import React from "react";
import ReactDOM from "react-dom/client";
import ConfirmModal from "../components/Common/ConfirmModal";

// Simple queue to avoid multiple overlapping modals.
const queue = [];
let isProcessing = false;

function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  const { message, opts, resolve } = queue.shift();

  // create container
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const cleanup = () => {
    try {
      root.unmount();
    } catch (err) {
      console.warn("confirmModal: error during unmount", err);
    }
    try {
      document.body.removeChild(container);
    } catch (err) {
      console.warn("confirmModal: error removing container", err);
    }
    isProcessing = false;
    // next in queue
    setTimeout(processQueue, 0);
  };

  function onConfirm() {
    resolve(true);
    cleanup();
  }

  function onCancel() {
    resolve(false);
    cleanup();
  }

  const props = {
    open: true,
    title: opts?.title || "Confirmer",
    message: message || opts?.message || "Confirmer ?",
    onCancel,
    onConfirm,
    cancelLabel: opts?.cancelLabel || "Annuler",
    confirmLabel: opts?.confirmLabel || "Confirmer",
    confirmClassName: opts?.confirmClassName || undefined,
  };

  root.render(React.createElement(ConfirmModal, props));
}

/**
 * Show a ConfirmModal and return a Promise that resolves to true (confirm) or false (cancel).
 * Usage: const ok = await confirmModal('Supprimer cet item?')
 */
export default function confirmModal(message, opts = {}) {
  if (typeof window === "undefined") return Promise.resolve(false);
  return new Promise((resolve) => {
    queue.push({ message, opts, resolve });
    processQueue();
  });
}
