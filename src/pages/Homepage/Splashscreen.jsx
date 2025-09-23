// SPLASHSCREEN

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SUPABASE_LOGO, localLogo } from "../../constants/logo";

export default function Splashscreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [leaving, setLeaving] = useState(false);
  const headingRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const navTimerRef = useRef(null);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homepage", { replace: true });
      return;
    }

    const TOTAL = 5000; // ms
    const FADE = 600; // ms (match CSS)

    // Respect reduced motion preferences by shortening/ removing animation
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const effectiveTotal = prefersReduced ? 1000 : TOTAL;
    const effectiveFade = prefersReduced ? 0 : FADE;

    const triggerLeave = () => {
      setLeaving(true);
      setAnnounce("Ouverture de la page d’accueil…");
    };

    leaveTimerRef.current = setTimeout(
      triggerLeave,
      Math.max(0, effectiveTotal - effectiveFade)
    );
    navTimerRef.current = setTimeout(
      () => navigate("/homepage", { replace: true }),
      effectiveTotal
    );

    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, [isAuthenticated, navigate]);

  const [src, setSrc] = useState(SUPABASE_LOGO);

  const skipNow = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setAnnounce("Passage directement à la page d’accueil…");
    navigate("/homepage", { replace: true });
  };

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby="splash-title"
      className={`splashscreen center-screen ${leaving ? "leaving" : ""}`}
    >
      <a href="/homepage" onClick={skipNow} className="sr-only">
        Passer l'intro et aller au contenu
      </a>
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
        <h1
          id="splash-title"
          ref={headingRef}
          tabIndex={-1}
          className="mt-[-3rem] text-3xl text-center front-heading title font-bold"
          style={{ fontFamily: "Fredoka" }}
        >
          Les bons plans,
          <br />à vol d'oiseau
        </h1>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {announce}
      </div>
    </section>
  );
}
