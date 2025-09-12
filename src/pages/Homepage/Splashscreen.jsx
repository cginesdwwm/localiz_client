// SPLASHSCREEN

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SUPABASE_LOGO, localLogo } from "../../constants/logo";

export default function Splashscreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homepage", { replace: true });
      return;
    }

    const TOTAL = 5000; // ms
    const FADE = 600; // ms (match CSS)

    const leaveTimer = setTimeout(() => setLeaving(true), TOTAL - FADE);
    const navTimer = setTimeout(
      () => navigate("/homepage", { replace: true }),
      TOTAL
    );

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(navTimer);
    };
  }, [isAuthenticated, navigate]);

  const [src, setSrc] = useState(SUPABASE_LOGO);

  return (
    <div className={`splashscreen center-screen ${leaving ? "leaving" : ""}`}>
      <div className="flex-col-center">
        <img
          src={src}
          alt="Localiz logo"
          width={350}
          height={350}
          className="block"
          onError={() => {
            // fallback to local image if Supabase URL fails
            if (src !== localLogo) setSrc(localLogo);
          }}
        />
        <h1 className="mt-0 text-center front-heading title">
          Les bons plans,
          <br />à vol d'oiseau
        </h1>
      </div>
    </div>
  );
}
