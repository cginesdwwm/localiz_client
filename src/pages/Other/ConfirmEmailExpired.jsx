import React from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmEmailExpired() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-semibold">Lien expiré</h1>
      <p className="mt-4">
        Le lien de confirmation a expiré. Vous pouvez renvoyer un email de
        confirmation depuis la page d'inscription.
      </p>
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate("/register")}
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
