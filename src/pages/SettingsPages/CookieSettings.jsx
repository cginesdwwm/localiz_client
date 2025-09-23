// PAGE PARAMETRES DES COOKIES

import { useEffect, useRef, useState } from "react";
import BackLink from "../../components/Common/BackLink";
import { saveMyCookiePrefs } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";
import ToggleSwitch from "../../components/Common/ToggleSwitch";
import { Link } from "react-router-dom";
import Button from "../../components/Common/Button";
import { notify } from "../../utils/notify";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

export default function CookieSettings() {
  const STORAGE_KEY = "localiz_cookie_preferences";
  const { isAuthenticated } = useAuth();

  const [prefs, setPrefs] = useState({
    measurement: false,
    personalization: false,
    marketing: false,
  });

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setPrefs((p) => ({ ...p, ...parsed }));
    } catch (e) {
      console.warn("Failed to load cookie prefs:", e);
    }
  }, []);

  const setPref = (key, value) => setPrefs((s) => ({ ...s, [key]: value }));

  async function handleConfirm() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      // If authenticated, persist on server as well
      if (isAuthenticated) {
        try {
          await saveMyCookiePrefs(prefs);
        } catch (e) {
          console.warn("Failed to persist cookie prefs on server", e);
        }
      }
      notify.success("Sélection enregistrée");
    } catch (e) {
      console.warn("Failed to save prefs to localStorage", e);
      notify.error("Impossible d'enregistrer la sélection");
    }
  }

  async function handleAcceptAll() {
    const next = { measurement: true, personalization: true, marketing: true };
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to persist prefs locally", e);
    }
    if (isAuthenticated) {
      saveMyCookiePrefs(next).catch((e) => console.warn(e));
    }
    notify.success("Tous les cookies activés");
  }

  async function handleRefuseAll() {
    const next = {
      measurement: false,
      personalization: false,
      marketing: false,
    };
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to persist prefs locally", e);
    }
    if (isAuthenticated) {
      saveMyCookiePrefs(next).catch((e) => console.warn(e));
    }
    notify.success("Tous les cookies désactivés");
  }

  const headingRef = useRef(null);
  useDocumentTitle("Paramètres des cookies");
  useFocusHeading(headingRef);

  return (
    <main className="p-10 mx-auto" role="main">
      <BackLink to="/settings" fixed />

      <div className="p-12">
        <h1
          className="text-3xl font-quicksand !font-bold mb-4"
          style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
          ref={headingRef}
        >
          Paramètres des cookies
        </h1>

        <section className="mt-10 text-left">
          <p>
            Chez <strong>Localiz</strong>,{" "}
            <strong>ta vie privée compte.</strong>
          </p>

          <p>
            Ici, tu peux à tout moment choisir et gérer les cookies utilisés
            dans l'application, en fonction de tes préférences.
          </p>
        </section>

        <section className="mt-8 text-left">
          <h2 className="text-[20px] font-semibold font-quicksand mb-3 underline">
            C'est quoi, un cookie ?
          </h2>

          <p>
            Les cookies sont de petits fichiers stockés sur ton appareil
            (smartphone, tablette…). Ils permettent à Localiz de fonctionner
            correctement, de mémoriser tes réglages, de t'afficher des contenus
            utiles, et d'améliorer ton expérience.
          </p>
        </section>

        <section className="mt-8 text-left">
          <h2 className="text-[20px] font-semibold font-quicksand mb-3 underline">
            Tes préférences
          </h2>
          <p>
            Tu peux activer ou désactiver les catégories de cookies ci-dessous :
          </p>

          <div className="mt-6">
            {/* Essentiels */}
            <div>
              <p
                id="cookie-essential"
                className="font-quicksand !font-bold text-[16px] m-0"
              >
                ✅ Cookies essentiels (obligatoires)
              </p>
              <p>
                Ces cookies sont indispensables au bon fonctionnement de Localiz
                (connexion, sécurité, langue, accessibilité, etc.). Tu ne peux
                pas les désactiver. Toujours actifs.
              </p>
              <div className="mt-3">
                <ToggleSwitch
                  checked={true}
                  disabled
                  ariaLabel="Cookies essentiels"
                  aria-labelledby="cookie-essential"
                />
              </div>
            </div>

            {/* Mesure d'audience */}
            <div className="mt-8">
              <p
                id="cookie-measurement"
                className="font-quicksand !font-bold text-[16px] m-0"
              >
                📊 Cookies de mesure d'audience
              </p>
              <p>
                Ils nous aident à comprendre comment tu utilises Localiz (pages
                visitées, fréquence, clics…) pour améliorer l'appli. Aucune
                donnée personnelle identifiable n'est enregistrée.
              </p>
              <div className="mt-3">
                <ToggleSwitch
                  checked={prefs.measurement}
                  onChange={(v) => setPref("measurement", v)}
                  ariaLabel="Cookies de mesure d'audience"
                  aria-labelledby="cookie-measurement"
                />
              </div>
            </div>

            {/* Personnalisation */}
            <div className="mt-8">
              <p
                id="cookie-personalization"
                className="font-quicksand !font-bold text-[16px] m-0"
              >
                🎯 Cookies de personnalisation
              </p>
              <p>
                Ces cookies permettent de t'afficher des bons plans, annonces ou
                suggestions en lien avec ta localisation ou tes centres
                d'intérêt.
              </p>
              <div className="mt-3">
                <ToggleSwitch
                  checked={prefs.personalization}
                  onChange={(v) => setPref("personalization", v)}
                  ariaLabel="Cookies de personnalisation"
                  aria-labelledby="cookie-personalization"
                />
              </div>
            </div>

            {/* Marketing */}
            <div className="mt-8">
              <p
                id="cookie-marketing"
                className="font-quicksand !font-bold text-[16px] m-0"
              >
                📢 Cookies marketing & réseaux sociaux
              </p>
              <p>
                Utilisés si tu partages du contenu via les réseaux sociaux ou si
                on affiche un jour des événements ou offres partenaires liés à
                ta région.
              </p>
              <div className="mt-3">
                <ToggleSwitch
                  checked={prefs.marketing}
                  onChange={(v) => setPref("marketing", v)}
                  ariaLabel="Cookies marketing et réseaux sociaux"
                  aria-labelledby="cookie-marketing"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 mb-12">
            <p className="font-quicksand !font-bold text-[18px] mb-3 underline">
              Besoin de plus d'infos ?
            </p>
            <p className="m-0">
              Tu peux consulter la{" "}
              <Link to="/legal#cookies" className="underline">
                Politique de confidentialité
              </Link>{" "}
              ou nous écrire à
              <a href="mailto:contact@localiz.fr" className="underline ml-1">
                contact@localiz.fr
              </a>
              .
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 items-center">
            <div>
              <Button onClick={() => handleConfirm()} variant="primary">
                Confirmer la sélection
              </Button>
            </div>
            <div>
              <Button onClick={() => handleAcceptAll()} variant="primary">
                Accepter tout
              </Button>
            </div>
            <div>
              <Button onClick={() => handleRefuseAll()} variant="danger">
                Refuser tout
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
