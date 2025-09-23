// PAGE PARAMETRES

import { Link } from "react-router-dom";
import BackLink from "../../components/Common/BackLink";
import { useAuth } from "../../context/AuthContext";
import { useRef, useState } from "react";
import ConfirmModal from "../../components/Common/ConfirmModal";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

// react-icons imports
import { TbLanguage, TbLogout } from "react-icons/tb";
import { FaPalette, FaQuestionCircle, FaCookieBite } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa6";
import { SlSpeech } from "react-icons/sl";

const ITEMS = [
  { to: "/contact", label: "Contact", Icon: SlSpeech },
  { to: "/settings/language", label: "Langue", Icon: TbLanguage },
  { to: "/settings/theme", label: "Thème", Icon: FaPalette },
  { to: "/about", label: "À propos", Icon: FaQuestionCircle },
  { to: "/legal", label: "Informations légales", Icon: FaNewspaper },
  {
    to: "/settings/cookies",
    label: "Paramètres des cookies",
    Icon: FaCookieBite,
  },
];

// Fallback for any legacy <Icon name="..." /> usage elsewhere in the app.
function Icon({ name, className = "w-5 h-5 mr-3", ...props }) {
  const map = {
    globe: TbLanguage,
    sun: FaPalette,
    info: FaQuestionCircle,
    doc: FaNewspaper,
    cookie: FaCookieBite,
  };
  const Comp = map[name];
  if (!Comp) return null;
  return <Comp className={className} aria-hidden {...props} />;
}

export default function Settings() {
  const { logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const headingRef = useRef(null);
  useDocumentTitle("Paramètres");
  useFocusHeading(headingRef);

  function handleLogout() {
    setConfirmOpen(true);
  }

  function confirmLogout() {
    setConfirmOpen(false);
    logout();
  }

  return (
    <main className="p-4 max-w-lg mx-auto" role="main">
      <BackLink to="/profile/me/manage-account" fixed />

      <h1
        className="text-3xl font-quicksand !font-bold mt-6 mb-4"
        style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
        ref={headingRef}
      >
        Paramètres
      </h1>

      <div className="mt-6">
        {ITEMS.map((it) => {
          const IconComp = it.Icon;
          return (
            <div
              key={it.to}
              className="w-full flex items-center p-3 border-t border-white first:border-t-0"
            >
              <Link
                to={it.to}
                className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <IconComp className="w-5 h-5 mr-3" aria-hidden />
                <span className="font-quicksand !font-bold text-[16px]">
                  {it.label}
                </span>
              </Link>
            </div>
          );
        })}

        <div className="w-full flex items-center p-3 border-t border-white first:border-t-0">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 group cursor-pointer"
          >
            <TbLogout
              className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 transition-colors"
              aria-hidden
            />
            <span className="font-quicksand !font-bold text-[16px] text-red-500 group-hover:text-red-600">
              Se déconnecter
            </span>
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Confirmer la déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmLogout}
        cancelLabel="Annuler"
        confirmLabel="Déconnecter"
        confirmClassName="px-3 py-1 bg-red-500 text-white rounded"
      />
    </main>
  );
}
