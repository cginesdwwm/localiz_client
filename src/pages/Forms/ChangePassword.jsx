// PAGE MODIFIER LE MOT DE PASSE

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import { useNavigate } from "react-router-dom";
import BackLink from "../../components/Common/BackLink";

const schema = yup.object({
  currentPassword: yup.string().required("Le mot de passe actuel est requis"),
  newPassword: yup
    .string()
    .required("Le nouveau mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(30, "Le mot de passe ne peut pas dépasser 30 caractères"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("newPassword"), null],
      "Les mots de passe ne correspondent pas"
    )
    .required("La confirmation est requise"),
});

export default function ChangePassword() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        notify.success(result.message || "Mot de passe modifié");
        reset();
        try {
          sessionStorage.setItem("password_changed", String(Date.now()));
        } catch {
          /* ignore */
        }
        navigate("/password/success", {
          state: { passwordChangedAt: Date.now() },
        });
      } else {
        notify.error(
          result.message || "Erreur lors du changement de mot de passe"
        );
      }
    } catch (err) {
      console.error(err);
      notify.error("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="h-screen center-screen bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BackLink
            to="/settings/manage-account"
            label="Modifier le mot de passe"
          />
        </div>

        <div className="mb-4">
          <p className="text-[16px] !font-bold font-quicksand">
            Quelques petits conseils pour créer un mot de passe sécurisé :
          </p>
          <ul
            className="mt-2 list-disc list-inside"
            style={{ fontFamily: "Mulish, sans-serif" }}
          >
            <li>Utiliser au minimum 8 caractères.</li>
            <li>
              Utiliser un mélange de lettres, de chiffres et de caractères
              spéciaux (ex. : %!$#).
            </li>
            <li>
              Ne pas se baser sur des informations personnelles ou des mots du
              dictionnaire.
            </li>
          </ul>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FocusRing>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="currentPassword"
                  type="password"
                  placeholder="Mot de passe actuel"
                  error={errors.currentPassword?.message}
                  className="h-12"
                />
              )}
            />

            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="newPassword"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  error={errors.newPassword?.message}
                  className="h-12"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  error={errors.confirmPassword?.message}
                  className="h-12"
                />
              )}
            />
          </FocusRing>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="cta"
              className="h-12 font-semibold text-base"
              disabled={isSubmitting}
            >
              Modifier le mot de passe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
