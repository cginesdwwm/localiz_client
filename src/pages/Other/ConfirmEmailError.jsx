import React from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmEmailError() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-semibold">Erreur de confirmation</h1>
      <p className="mt-4">
        Une erreur est survenue lors de la confirmation. Vérifiez le lien ou
        contactez le support.
      </p>
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate("/")}
        >
          Accueil
        </button>
      </div>
    </div>
  );
}
