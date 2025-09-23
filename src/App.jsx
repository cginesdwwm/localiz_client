/*
  - Composant principal qui définit la mise en page générale (header + contenu + toaster).
  - Outlet (react-router) est une zone où les composants enfants s'affichent
    en fonction de la route courante (définie dans `router.jsx`).
  - Toaster affiche les notifications (ex: succès, erreurs) si la librairie est utilisée.
*/

import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom"; // Emplacement des routes enfants
import "./App.css"; // Styles locaux de l'application
import Header from "./components/Header/Header"; // Le header (nav)
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast"; // Notifications toast
import { BlogProvider } from "./context/BlogContext";

function App() {
  const location = useLocation();
  const pathname = location?.pathname || "/";
  const [routeMsg, setRouteMsg] = useState("");
  const suppressNextAnnounceRef = useRef(false);

  // Announce route changes in a polite live region using title or page heading
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // If focus is already on a heading, skip announcing to prevent duplication
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
          // Since we programmatically manage focus to headings in many pages,
          // avoid double announcing right after setting the title
          suppressNextAnnounceRef.current = true;
        }
      } catch {
        // ignore
      }
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  // Show the header only for a small set of primary pages (whitelist).
  // This avoids accidentally hiding the header on many pages when new routes are added.
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

  // Explicitly hide header on pages that require full focus (no chrome)
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
        <BlogProvider>
          <main id="main-content" className="flex-1" role="main">
            <Outlet />
          </main>
        </BlogProvider>
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
      <BlogProvider>
        {shouldShowHeader && <Header />}
        <main id="main-content" className="flex-1" role="main">
          <Outlet />
        </main>
        {shouldShowHeader && <Footer />}
      </BlogProvider>
      <Toaster position="top-center" toastOptions={{ duration: 6000 }} />
      <div className="sr-only" role="status" aria-live="polite">
        {routeMsg}
      </div>
    </div>
  );

  return AppContent;
}

export default App;
