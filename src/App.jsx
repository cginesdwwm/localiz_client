/*
  App.jsx
  - Composant principal qui définit la mise en page générale (header + contenu + toaster).
  - Outlet (react-router) est une zone où les composants enfants s'affichent
    en fonction de la route courante (définie dans `router.jsx`).
  - Toaster affiche les notifications (ex: succès, erreurs) si la librairie est utilisée.
*/

import { Outlet, useLocation } from "react-router-dom"; // Emplacement des routes enfants
import "./App.css"; // Styles locaux de l'application
import Header from "./components/Header/Header"; // Le header (nav)
import { Toaster } from "react-hot-toast"; // Notifications toast
import { BlogProvider } from "./context/BlogContext";

function App() {
  const location = useLocation();
  const pathname = location?.pathname || "/";

  // Routes/prefixes dans lesquelles on ne veut pas afficher le header
  const hideHeaderFor = [
    "/",
    "/login",
    "/register",
    "/register/success",
    "/forgot-password",
    "/change-password",
    "/confirm-email",
  ];

  const shouldHideHeader =
    hideHeaderFor.includes(pathname) ||
    hideHeaderFor.some((p) => pathname.startsWith(p + "/"));

  return (
    <div className="h-screen ">
      <BlogProvider>
        {!shouldHideHeader && <Header />}
        <main>
          <Outlet />
        </main>
      </BlogProvider>
      <Toaster position="top-center" toastOptions={{ duration: 6000 }} />
    </div>
  );
}

export default App;
