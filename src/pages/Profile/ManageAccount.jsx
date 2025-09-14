// PAGE GERER MON COMPTE
import BackLink from "../../components/Common/BackLink";

export default function ManageAccount() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <BackLink fixed to="/profile/me" label="Gérer mon compte" />
      </div>

      <p className="text-sm text-muted">
        Ici vous pouvez mettre à jour vos informations de compte.
      </p>
    </div>
  );
}
