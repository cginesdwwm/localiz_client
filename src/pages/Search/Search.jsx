/**
 * PAGE RECHERCHE
 *
 * Rôle: Vue simple qui affiche le titre de la section Recherche. Le contenu
 * détaillé peut être géré par des sous-pages/onglets (bons plans, trocs, dons)
 * selon la configuration du routeur.
 *
 * Accessibilité: Aucune balise <main> ici, cette page est rendue dans le
 * <main id="main-content"> unique défini dans App.jsx. Le titre sert de point
 * de repère visuel pour les utilisateurs.
 */

export default function Search() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Rechercher</h2>
    </div>
  );
}
