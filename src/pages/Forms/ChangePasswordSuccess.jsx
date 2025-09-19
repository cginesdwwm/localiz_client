import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ChangePasswordSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user didn't arrive here via the success navigation, check sessionStorage
    const fromState = !!location?.state?.passwordChangedAt;
    let fromSession = false;
    try {
      fromSession = !!sessionStorage.getItem("password_changed");
    } catch {
      /* ignore */
    }

    if (!fromState && !fromSession) {
      // Not allowed to view this page directly
      navigate("/change-password", { replace: true });
      return;
    }

    // Cleanup the session flag after a short time so reloads are allowed once
    try {
      sessionStorage.removeItem("password_changed");
    } catch {
      /* ignore */
    }
  }, [location, navigate]);

  return (
    <div className="center-screen px-4">
      <div className="w-full max-w-md px-4">
        <h1
          className="front-heading text-3xl mb-3 font-bold"
          style={{ fontFamily: "Fredoka" }}
        >
          Mot de passe modifié !
        </h1>
        <p className="mb-3">
          Votre mot de passe a bien été mis à jour. Vous pouvez maintenant vous
          connecter avec votre nouveau mot de passe.
        </p>

        <div className="flex gap-3">
          <NavLink to="/login" className="btn btn-cta px-4 py-2 rounded">
            Aller à la page de connexion
          </NavLink>

          <NavLink to="/homepage" className="btn btn-ghost px-4 py-2 rounded">
            Retour à l'accueil
          </NavLink>
        </div>
      </div>
    </div>
  );
}
