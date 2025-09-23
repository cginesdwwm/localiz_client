// PAGE D'ACCUEIL

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { WELCOME_MESSAGES, DAILY_GREETINGS } from "../../constants";

const SUPABASE_FAVICON =
  "https://pjrrvzxomdowrraykone.supabase.co/storage/v1/object/public/public-assets/favicon.webp";

export default function Homepage() {
  const { user, isAuthenticated } = useAuth() || {};

  // compute display name: prefer firstName if user chose to show it, otherwise username
  const displayName = (() => {
    if (!user) return null;
    if (user?.showFirstName && (user?.firstName || user?.prenom)) {
      return user.firstName || user.prenom || null;
    }
    return user.username || user?.email || null;
  })();
  // Pick a random message on first render
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!WELCOME_MESSAGES || WELCOME_MESSAGES.length === 0) return;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // Use a per-user key when authenticated so each user can have their own message
    const userId =
      isAuthenticated && user ? user._id || user.id || user.username : null;
    const storageKey = userId
      ? `localiz_welcome_${userId}_${today}`
      : `localiz_welcome_${today}`;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const idx = parseInt(stored, 10);
        if (!Number.isNaN(idx) && WELCOME_MESSAGES[idx]) {
          setMessage(WELCOME_MESSAGES[idx]);
          return;
        }
      }

      const idx = Math.floor(Math.random() * WELCOME_MESSAGES.length);
      localStorage.setItem(storageKey, String(idx));
      setMessage(WELCOME_MESSAGES[idx]);
    } catch {
      // localStorage might be unavailable (privacy mode). Fallback to random per render.
      const idx = Math.floor(Math.random() * WELCOME_MESSAGES.length);
      setMessage(WELCOME_MESSAGES[idx]);
    }
  }, [isAuthenticated, user]);

  // Pick a daily greeting template for authenticated users
  const [greetingTpl, setGreetingTpl] = useState(
    DAILY_GREETINGS?.[0] || "[Prénom]"
  );
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (!DAILY_GREETINGS || DAILY_GREETINGS.length === 0) return;

    const today = new Date().toISOString().slice(0, 10);
    const storageKey = `localiz_greeting_${
      user._id || user.id || user.username
    }_${today}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && DAILY_GREETINGS[parseInt(stored, 10)]) {
        setGreetingTpl(DAILY_GREETINGS[parseInt(stored, 10)]);
        return;
      }
      const idx = Math.floor(Math.random() * DAILY_GREETINGS.length);
      localStorage.setItem(storageKey, String(idx));
      setGreetingTpl(DAILY_GREETINGS[idx]);
    } catch {
      const idx = Math.floor(Math.random() * DAILY_GREETINGS.length);
      setGreetingTpl(DAILY_GREETINGS[idx]);
    }
  }, [isAuthenticated, user]);

  return (
    <section aria-labelledby="homepage-title" className="mt-4 text-center">
      <h1
        id="homepage-title"
        className="heading text-center text-[28px] font-semibold"
        style={{ fontFamily: "Fredoka, sans-serif" }}
      >
        {!isAuthenticated
          ? "Bienvenue sur Localiz !"
          : (() => {
              const name = displayName || "";
              const tpl = greetingTpl || "[Prénom]";
              if (tpl.includes("[Prénom]"))
                return tpl.replace(/\[Prénom\]/g, name);
              return name ? `${tpl}, ${name}` : tpl;
            })()}
      </h1>
      <img
        src={SUPABASE_FAVICON}
        alt="Localiz logo"
        className="w-24 h-24 p-0 m-0 block mx-auto"
      />
      {isAuthenticated && (
        <p
          className="text-[18px]"
          style={{ fontFamily: "Fredoka, sans-serif" }}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </section>
  );
}
