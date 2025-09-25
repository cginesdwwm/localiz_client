/*
  Composant principal : mise en page générale (header + contenu + toaster)
  - Outlet (react-router) : zone où s'affichent les composants selon la route courante (voir `router.jsx`).
  - Toaster : notifications (succès, erreurs) si la librairie est utilisée.
*/

import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom"; // Emplacement des routes enfants
import "./App.css"; // Styles locaux de l'application
import Header from "./components/Header/Header"; // Le header (nav)
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast"; // Notifications toast

function App() {
  const location = useLocation();
  const pathname = location?.pathname || "/";
  const [routeMsg, setRouteMsg] = useState("");
  const suppressNextAnnounceRef = useRef(false);

  // Annonce des changements de route dans une zone live polie (titre ou heading de page)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Si le focus est déjà sur un titre, on n'annonce pas (évite les doublons)
        const ae = document.activeElement;
        const isHeadingFocused =
          !!ae &&
          ((ae.tagName &&
            (ae.tagName.toLowerCase() === "h1" ||
              ae.tagName.toLowerCase() === "h2")) ||
            (ae.getAttribute && ae.getAttribute("role") === "heading"));
        if (isHeadingFocused || suppressNextAnnounceRef.current) {
          suppressNextAnnounceRef.current = false;
          return;
        }

        let title = document?.title || "";
        if (!title) {
          const main = document.getElementById("main-content");
          const heading = (main || document).querySelector("h1, h2");
          title = heading?.textContent?.trim() || pathname;
        }
        setRouteMsg(`Page: ${title}`);
      } catch {
        setRouteMsg(`Page mise à jour`);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Set document.title from the current page heading for consistency
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const main = document.getElementById("main-content");
        const heading = (main || document).querySelector("h1, h2");
        const text = heading?.textContent?.trim();
        if (text) {
          document.title = `${text} | Localiz`;
          // Comme on gère souvent le focus programmatique sur les titres,
          // on évite l'annonce immédiate juste après avoir défini le titre
          suppressNextAnnounceRef.current = true;
        }
      } catch {
        // ignore
      }
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  // N'afficher le header que sur un petit ensemble de pages principales (liste blanche)
  // afin d'éviter des masquages accidentels lors de l'ajout de nouvelles routes.
  const showHeaderFor = [
    "/homepage",
    "/profile/me",
    "/profile",
    "/listings",
    "/deals",
    "/search",
  ];

  const shouldShowHeader =
    showHeaderFor.includes(pathname) ||
    showHeaderFor.some((p) => pathname.startsWith(p + "/"));

  // Cacher explicitement le header sur certaines pages (plein écran, sans chrome)
  if (
    pathname === "/profile/me/manage-account" ||
    pathname === "/deals/create" ||
    pathname === "/listings/create"
  ) {
    // override whitelist
    return (
      <div className="min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only">
          Aller au contenu principal
        </a>
        <main id="main-content" className="flex-1" role="main">
          <Outlet />
        </main>
        <Toaster position="top-center" toastOptions={{ duration: 6000 }} />
        <div className="sr-only" role="status" aria-live="polite">
          {routeMsg}
        </div>
      </div>
    );
  }

  const AppContent = (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only">
        Aller au contenu principal
      </a>
      {shouldShowHeader && <Header />}
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
      {shouldShowHeader && <Footer />}
      <Toaster position="top-center" toastOptions={{ duration: 6000 }} />
      <div className="sr-only" role="status" aria-live="polite">
        {routeMsg}
      </div>
    </div>
  );

  return AppContent;
}

export default App;
