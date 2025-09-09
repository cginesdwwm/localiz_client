/*
  main.jsx
  Point d'entrée de l'application React.
  - createRoot : attache l'application au DOM (élément #root).
  - StrictMode : active des vérifications de développement supplémentaires.
  - RouterProvider : fournit le routeur (react-router) à l'application.
  - LikesProvider : contexte optionnel pour partager l'état des "likes" dans l'app.

  Remarque : ce fichier n'implémente pas de logique métier ; il compose les providers
  et démarre le rendu de l'application.
*/

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import LoadingSpinner from "./components/UI/LoadingSpinner";

const container = document.getElementById("root");

if (container.hasChildNodes()) {
  // Si il y a déjà du markup rendu par le serveur, on hydrate au lieu de monter
  hydrateRoot(
    container,
    <StrictMode>
      <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />
    </StrictMode>
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
