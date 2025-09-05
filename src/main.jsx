/*
  main.jsx
  Fichier d'entrée de l'application React.
  - createRoot: point d'attache de l'application dans le DOM (élément #root).
  - StrictMode: mode de développement React qui active des vérifications supplémentaires.
  - RouterProvider: fournis les routes (react-router) à l'application.
  - LikesProvider: un contexte (si présent) pour partager l'état des "likes" dans l'app.

  Commentaires: ce fichier ne contient pas de logique métier, il assemble simplement
  les fournisseurs (providers) et le routeur pour rendre l'application.
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";
import { LikesProvider } from "./context/LikesContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* AuthProvider doit envelopper RouterProvider pour que l'état d'authentification soit accessible partout. */}
    <AuthProvider>
      {/* Les autres providers peuvent être à l'intérieur ou à l'extérieur selon les besoins */}
      <LikesProvider>
        <RouterProvider router={router}></RouterProvider>
      </LikesProvider>
    </AuthProvider>
  </StrictMode>
);
