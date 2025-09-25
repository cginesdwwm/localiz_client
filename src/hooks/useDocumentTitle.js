import { useEffect } from "react";

/**
 * useDocumentTitle
 *
 * Hook léger pour définir `document.title` depuis une page/un composant.
 * - À l'échelle de l'app, `App.jsx` synchronise déjà le titre depuis le premier
 *   titre de page après la navigation pour l'annonceur de changement de route.
 * - Utiliser ce hook si une page a besoin d'un titre différent de son heading,
 *   ou pour définir le titre plus tôt que la synchro post-navigation de `App.jsx`.
 * - Éviter les doublons : privilégier une seule source de vérité (ce hook ou la
 *   synchro pilotée par le heading dans `App.jsx`) pour une route donnée.
 *
 * Paramètres :
 * - title: texte de base du titre à définir
 * - options.suffix: chaîne ajoutée au titre (par défaut " | Localiz")
 * - options.replace: forcer la mise à jour même si identique (par défaut false)
 */

export default function useDocumentTitle(title, options = {}) {
  const { suffix = " | Localiz", replace = false } = options;
  useEffect(() => {
    if (!title) return;
    const next = `${title}${suffix || ""}`;
    const prev = document.title;
    if (replace || prev !== next) {
      document.title = next;
    }
  }, [title, suffix, replace]);
}
