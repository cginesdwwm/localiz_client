import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmEmailSuccess() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/?message=success");
    }, 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-semibold">Confirmation réussie 🎉</h1>
      <p className="mt-4">
        Votre compte a été activé. Vous allez être redirigé vers l'accueil.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Si la redirection ne fonctionne pas,{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => navigate("/")}
        >
          cliquez ici
        </button>
        .
      </p>
    </div>
  );
}
