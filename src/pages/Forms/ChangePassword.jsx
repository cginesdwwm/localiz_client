// PAGE MODIFIER LE MOT DE PASSE

import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import ErrorSummary from "../../components/Common/ErrorSummary";
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
  const headingRef = useRef(null);

  useEffect(() => {
    // Move focus to the page heading for SRs upon mount
    headingRef.current?.focus();
  }, []);

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
    <section
      aria-labelledby="page-title"
      className="h-screen center-screen bg-[var(--bg)] px-4"
    >
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BackLink to="/profile/me/manage-account" fixed />
        </div>

        <h1
          id="page-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl !font-bold font-quicksand mb-4"
          style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
        >
          Modifier le mot de passe
        </h1>

        <section className="mb-4" aria-labelledby="tips-heading">
          <p className="text-[16px] !font-bold font-quicksand">
            Quelques petits conseils pour créer un mot de passe sécurisé :
          </p>
          <h2 id="tips-heading" className="sr-only">
            Conseils pour un mot de passe sécurisé
          </h2>
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
        </section>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting || undefined}
          noValidate
        >
          <ErrorSummary
            errors={errors}
            fields={[
              {
                name: "currentPassword",
                id: "currentPassword",
                label: "Mot de passe actuel",
              },
              {
                name: "newPassword",
                id: "newPassword",
                label: "Nouveau mot de passe",
              },
              {
                name: "confirmPassword",
                id: "confirmPassword",
                label: "Confirmation du mot de passe",
              },
            ]}
          />
          <FocusRing>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="currentPassword"
                  type="password"
                  label="Mot de passe actuel"
                  placeholder="Mot de passe actuel"
                  error={errors.currentPassword?.message}
                  required
                  autoComplete="current-password"
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
                  label="Nouveau mot de passe"
                  placeholder="Nouveau mot de passe"
                  error={errors.newPassword?.message}
                  required
                  autoComplete="new-password"
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
                  label="Confirmer le nouveau mot de passe"
                  placeholder="Confirmer le nouveau mot de passe"
                  error={errors.confirmPassword?.message}
                  required
                  autoComplete="new-password"
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
    </section>
  );
}
