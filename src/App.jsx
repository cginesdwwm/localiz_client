/*
  App.jsx
  - Composant principal qui définit la mise en page générale (header + contenu + toaster).
  - Outlet (react-router) est une zone où les composants enfants s'affichent
    en fonction de la route courante (définie dans `router.jsx`).
  - Toaster affiche les notifications (ex: succès, erreurs) si la librairie est utilisée.
*/

import { Outlet } from "react-router-dom"; // Emplacement des routes enfants
import "./App.css"; // Styles locaux de l'application
import Header from "./components/Header/Header"; // Le header (nav)
import { Toaster } from "react-hot-toast"; // Notifications toast
import { BlogProvider } from "./context/BlogContext";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <BlogProvider>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Outlet />
        </main>
      </BlogProvider>
      {/* Toaster global pour afficher des notifications (doit être présent une seule fois) */}
      <Toaster />
    </div>
  );
}

export default App;
