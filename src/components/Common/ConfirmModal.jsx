import React, { useEffect, useRef } from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  cancelLabel = "Annuler",
  confirmLabel = "Confirmer",
  confirmClassName = "btn btn-danger",
}) {
  const cancelRef = useRef(null);
  const titleId = "confirm-modal-title";
  const descId = "confirm-modal-desc";

  useEffect(() => {
    // Focus the least destructive action by default when opening
    if (open && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-card rounded p-4 w-11/12 max-w-sm text-black"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={message ? descId : undefined}
      >
        {title && (
          <h3 id={titleId} className="font-quicksand font-bold mb-2">
            {title}
          </h3>
        )}
        {message && (
          <p id={descId} className="text-sm mb-4">
            {message}
          </p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            className="btn !text-black"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button className={confirmClassName} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
