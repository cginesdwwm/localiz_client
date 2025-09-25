/**
 * Lien de retour accessible. Peut être rendu "fixe" (positionné en haut à gauche)
 * via un portail directement dans le body pour rester visible lors du scroll.
 *
 * Props:
 * - to: destination (route) ou -1 pour reculer dans l'historique
 * - className: classes CSS supplémentaires
 * - fixed: quand true, affiche le bouton en position fixe sur la page
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";

export default function BackLink({ to, className = "", fixed = false }) {
  const content = (
    <div className={`flex items-center ${className}`.trim()}>
      <NavLink
        to={to || -1}
        aria-label={"Retour"}
        title="Revenir en arrière"
        className="backlink-link p-0 flex items-center"
      >
        <span className="text-white text-3xl leading-none" aria-hidden="true">
          ←
        </span>
      </NavLink>
    </div>
  );

  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!fixed) return;
    const node = document.createElement("div");
    // Utilise des styles inline explicites pour éviter que le conteneur ne s'étende
    // sur toute la largeur de la fenêtre (certains environnements peuvent rendre
    // un élément fixe en bloc sur toute la largeur).
    node.style.position = "fixed";
    node.style.top = "1.5rem"; /* tailwind 'top-6' */
    node.style.left = "1.5rem"; /* tailwind 'left-6' */
    node.style.zIndex = "50";
    node.style.display = "inline-block";
    document.body.appendChild(node);
    setContainer(node);
    return () => {
      if (node.parentNode) node.parentNode.removeChild(node);
    };
  }, [fixed]);

  if (fixed) {
    if (!container) return null;
    return createPortal(content, container);
  }

  return content;
}
