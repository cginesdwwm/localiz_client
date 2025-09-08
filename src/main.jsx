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
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const container = document.getElementById("root");

if (container.hasChildNodes()) {
  // If there's already server-rendered markup, hydrate instead of mounting
  hydrateRoot(
    container,
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
