import React from "react";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded p-4 w-11/12 max-w-sm text-black">
        {title && <h3 className="font-quicksand font-bold mb-2">{title}</h3>}
        {message && <p className="text-sm mb-4">{message}</p>}
        <div className="flex gap-3 justify-end">
          <button className="btn !text-black" onClick={onCancel}>
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
