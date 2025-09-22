/*
  - Composant principal qui définit la mise en page générale (header + contenu + toaster).
  - Outlet (react-router) est une zone où les composants enfants s'affichent
    en fonction de la route courante (définie dans `router.jsx`).
  - Toaster affiche les notifications (ex: succès, erreurs) si la librairie est utilisée.
*/

import { Outlet, useLocation } from "react-router-dom"; // Emplacement des routes enfants
import "./App.css"; // Styles locaux de l'application
import Header from "./components/Header/Header"; // Le header (nav)
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast"; // Notifications toast
import { BlogProvider } from "./context/BlogContext";

function App() {
  const location = useLocation();
  const pathname = location?.pathname || "/";

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
    pathname === "/deals/create"
  ) {
    // override whitelist
    return (
      <div className="min-h-screen flex flex-col">
        <BlogProvider>
          <main className="flex-1">
            <Outlet />
          </main>
        </BlogProvider>
        <Toaster position="top-center" toastOptions={{ duration: 6000 }} />
      </div>
    );
  }

  const AppContent = (
    <div className="min-h-screen flex flex-col">
      <BlogProvider>
        {shouldShowHeader && <Header />}
        <main className="flex-1">
          <Outlet />
        </main>
        {shouldShowHeader && <Footer />}
      </BlogProvider>
      <Toaster position="top-center" toastOptions={{ duration: 6000 }} />
    </div>
  );

  return AppContent;
}

export default App;
