/**
 * Page Recherche — Bons plans
 *
 * Rôle: Point d’entrée de la vue Recherche filtrée sur les "Bons plans".
 * Cette page peut accueillir une barre de recherche/ filtres spécifiques.
 *
 * Accessibilité: Pas de balise <main> locale; la page est incluse dans le
 * <main id="main-content"> global d’App.jsx. Prévoir des libellés clairs
 * et des rôles ARIA si des filtres interactifs sont ajoutés.
 */

export default function SearchDeals() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Search - Deals</h2>
    </div>
  );
}
