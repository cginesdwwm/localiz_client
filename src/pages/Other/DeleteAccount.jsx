// PAGE SUPPRIMER MON COMPTE

import { useState } from "react";
import BackLink from "../../components/Common/BackLink";
import Button from "../../components/Common/Button";
import { requestAccountDeletion } from "../../api/user.api";
import { useNavigate, Link } from "react-router-dom";
import Checkbox from "../../components/Common/Checkbox";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/Common/ConfirmModal";

const REASONS = [
  "Je n'utilise plus Localiz.",
  "Je reçois trop de notifications / emails.",
  "J'ai trouvé une autre plateforme qui me convient mieux.",
  "Je n'ai pas trouvé assez de bons plans ou d'annonces intéressantes.",
  "Les fonctionnalités ne correspondent pas à mes besoins.",
  "J'ai rencontré des problèmes techniques.",
  "J'ai eu une mauvaise expérience avec un autre utilisateur.",
  "Je souhaite protéger mes données personnelles.",
  "Je veux créer un nouveau compte.",
  "Autre raison",
];

export default function DeleteAccount() {
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const trackEvent = (name, payload = {}) => {
    try {
      if (
        typeof window !== "undefined" &&
        window.dataLayer &&
        typeof window.dataLayer.push === "function"
      ) {
        window.dataLayer.push({ event: name, ...payload });
      } else if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", name, payload);
      }
    } catch {
      // swallow tracking errors
    }
  };

  async function confirmDelete() {
    setLoading(true);
    setError(null);
    trackEvent("delete_account_attempt", { reason, otherText });
    try {
      const payload = { reason, details: otherText };
      await requestAccountDeletion(payload);
      trackEvent("delete_account_success", { reason });
      // Logout the user locally and navigate to success screen
      try {
        await logout();
      } catch (err) {
        console.warn("logout after delete failed", err);
      }
      navigate("/delete-account/success");
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression");
      trackEvent("delete_account_error", {
        message: err.message,
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <BackLink to="/profile/me/manage-account" label="Supprimer mon compte" />

      <label className="block mb-2 mt-16 !font-bold">
        Raison de la suppression
      </label>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="block w-full rounded border px-3 py-2 input-surface"
      >
        <option value="">Sélectionner une raison...</option>
        {REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {reason === "Autre raison" && (
        <div className="mt-3">
          <label className="block mb-1">Dis-nous en plus (optionnel)</label>
          <textarea
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="w-full rounded border px-3 py-2 input-surface"
            rows={4}
          />
        </div>
      )}

      <p className="mt-4">
        Lorsque tu choisis de supprimer ton compte, il est d'abord{" "}
        <b>désactivé</b>. Pendant cette période, seules les équipes de Localiz y
        ont accès. Si tu souhaites annuler la suppression de ton compte, il te
        suffit de te reconnecter à l'application. La{" "}
        <b>suppression définitive</b> de ton compte et de toutes tes données
        sera effective après <b>30 jours</b>, comme précisé dans notre{" "}
        <Link to="/legal#privacy" className="underline font-medium">
          Politique de Confidentialité
        </Link>
        .
      </p>

      <div className="mt-8">
        <Checkbox
          id="confirm-delete"
          className="danger-checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          label={
            <span className="text-base">
              Je comprends que la suppression de mon compte est irréversible
              après 30 jours et que toutes mes données seront effacées.
            </span>
          }
        />
      </div>

      <div className="mt-6">
        <Button
          variant="danger"
          disabled={!confirmed || !reason || loading}
          onClick={() => setShowModal(true)}
        >
          {loading ? "Suppression..." : "Supprimer mon compte"}
        </Button>
      </div>

      {error && <p className="error-text mt-2">{error}</p>}

      {/* Confirmation modal (shared) */}
      <ConfirmModal
        open={showModal}
        title="Confirmer la suppression"
        message="Es-tu sûr de vouloir supprimer définitivement ton compte ? Cette action est irréversible après la période de 30 jours."
        onCancel={() => setShowModal(false)}
        onConfirm={confirmDelete}
        cancelLabel="Annuler"
        confirmLabel={loading ? "Suppression..." : "Confirmer la suppression"}
        confirmClassName="btn btn-danger"
      />
    </div>
  );
}
