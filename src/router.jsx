/*
  router.jsx
  - Définit les routes de l'application à l'aide de createBrowserRouter.
  - Chaque route a un `path` (URL) et un `element` (composant React à afficher).
  - Important pour débutant : les chemins de route sont sensibles à la casse par
    défaut dans react-router v6+ (donc `/blog` != `/Blog`).
    Pour que l'URL `/Blog` fonctionne aussi, on ajoute un alias avec le même composant.
*/

import { createBrowserRouter } from "react-router-dom";
import { rootLoader } from "./loaders/rootLoader";
import App from "./App";

import UserConnected from "./components/ProtectedRoutes/UserConnected";
import UserNotConnected from "./components/ProtectedRoutes/UserNotConnected";

// Providers bougés dans la route racine pour qu'ils soient bien dans le routeur de données
import { AuthProvider } from "./context/AuthContext";
import { LikesProvider } from "./context/LikesContext";

// Composants de routes protégées (auth/admin)²
import AdminRoute from "./components/routing/AdminRoute";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";

// Aide à valider les paramètres de route (ex: IDs)
const validateRouteId = (id) => {
  // Validation basique - ajuster la regex selon le format attendu pour les IDs
  return /^[a-zA-Z0-9-_]{1,50}$/.test(id);
};

import Deals from "./pages/Deals/Deals";
import DealDetails from "./pages/Deals/DealDetails";

import Register from "./pages/Forms/Register";
import RegisterSuccess from "./pages/Forms/RegisterSuccess";
import Login from "./pages/Forms/Login";
import ChangePassword from "./pages/Forms/ChangePassword";
import ForgotPassword from "./pages/Forms/ForgotPassword";

import Homepage from "./pages/Homepage/Homepage";
import Splashscreen from "./pages/Homepage/Splashscreen";

import ListingDetails from "./pages/Listings/ListingDetails";
import SwapAndDonate from "./pages/Listings/SwapAndDonate";

import About from "./pages/Other/About";
import DeleteAccount from "./pages/Other/DeleteAccount";
import ErrorPage from "./pages/Other/ErrorPage";
import LegalInfo from "./pages/Other/LegalInfo";
import ConfirmEmail from "./pages/Other/ConfirmEmail";
import ConfirmEmailSuccess from "./pages/Other/ConfirmEmailSuccess";
import ConfirmEmailExpired from "./pages/Other/ConfirmEmailExpired";
import ConfirmEmailError from "./pages/Other/ConfirmEmailError";

import ProfileMe from "./pages/Profile/ProfileMe";
import ProfileOther from "./pages/Profile/ProfileOther";

import Search from "./pages/Search/Search";
import SearchDeals from "./pages/Search/SearchDeals";
import SearchDonations from "./pages/Search/SearchDonations";
import SearchSwaps from "./pages/Search/SearchSwaps";

import CookieSettings from "./pages/SettingsPages/CookieSettings";
import Language from "./pages/SettingsPages/Language";
import ManageAccount from "./pages/SettingsPages/ManageAccount";
import Settings from "./pages/SettingsPages/Settings";
import Theme from "./pages/SettingsPages/Theme";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <LikesProvider>
          <App />
        </LikesProvider>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { path: "/", element: <Splashscreen /> },
      { path: "/homepage", element: <Homepage /> },

      // --- Auth / Forms ---
      {
        path: "/register",
        element: (
          <UserNotConnected>
            <Register />
          </UserNotConnected>
        ),
      },
      { path: "/register/success", element: <RegisterSuccess /> },
      {
        path: "/login",
        element: (
          <UserNotConnected>
            <Login />
          </UserNotConnected>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <UserNotConnected>
            <ForgotPassword />
          </UserNotConnected>
        ),
      },
      {
        path: "/change-password",
        element: (
          <UserConnected>
            <ChangePassword />
          </UserConnected>
        ),
      },

      // --- Deals ---
      { path: "/deals", element: <Deals /> },
      {
        path: "/deals/:id",
        element: <DealDetails />,
        loader: ({ params }) => {
          if (!validateRouteId(params.id)) {
            throw new Response("Annonce introuvable", { status: 400 });
          }
          return null;
        },
      },

      // --- Listings (Troc & Don) ---
      { path: "/listings", element: <SwapAndDonate /> },
      {
        path: "/listings/:id",
        element: <ListingDetails />,
        loader: ({ params }) => {
          if (!validateRouteId(params.id)) {
            throw new Response("Annonce introuvable", { status: 400 });
          }
          return null;
        },
      },

      // --- Profiles ---
      {
        path: "/profile/me",
        element: (
          <UserConnected>
            <ProfileMe />
          </UserConnected>
        ),
      },
      {
        path: "/profile/:userId",
        element: <ProfileOther />,
        loader: ({ params }) => {
          if (!validateRouteId(params.userId)) {
            throw new Response("Utilisateur introuvable", { status: 400 });
          }
          return null;
        },
      },

      // --- Search ---
      { path: "/search", element: <Search /> },
      { path: "/search/deals", element: <SearchDeals /> },
      { path: "/search/donations", element: <SearchDonations /> },
      { path: "/search/swaps", element: <SearchSwaps /> },

      // --- Settings ---
      {
        path: "/settings",
        element: (
          <UserConnected>
            <Settings />
          </UserConnected>
        ),
      },
      {
        path: "/settings/manage-account",
        element: (
          <UserConnected>
            <ManageAccount />
          </UserConnected>
        ),
      },
      { path: "/settings/theme", element: <Theme /> },
      { path: "/settings/cookies", element: <CookieSettings /> },
      { path: "/settings/language", element: <Language /> },

      // --- Other ---
      { path: "/about", element: <About /> },
      { path: "/confirm-email", element: <ConfirmEmail /> },
      { path: "/confirm-email/success", element: <ConfirmEmailSuccess /> },
      { path: "/confirm-email/expired", element: <ConfirmEmailExpired /> },
      { path: "/confirm-email/error", element: <ConfirmEmailError /> },
      { path: "/legal", element: <LegalInfo /> },
      {
        path: "/delete-account",
        element: (
          <UserConnected>
            <DeleteAccount />
          </UserConnected>
        ),
      },

      // --- Admin Routes ---
      {
        path: "admin",
        element: <AdminRoute />, // Protège toutes les routes enfants
        children: [
          {
            path: "",
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "users", element: <AdminUsers /> },
            ],
          },
        ],
      },
    ],
  },
]);
