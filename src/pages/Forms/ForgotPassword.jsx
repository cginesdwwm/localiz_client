// PAGE MOT DE PASSE OUBLIE

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink } from "react-router-dom";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import { requestPasswordReset } from "../../api/auth.api";

export default function ForgotPassword() {
  const defaultValues = { email: "" };

  const schema = yup.object({
    email: yup
      .string()
      .email("Format email non valide.")
      .required("L'email est obligatoire."),
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(values) {
    try {
      await requestPasswordReset(values);
      setSubmitted(true);
    } catch (error) {
      console.error("Erreur requête reset mot de passe:", error);
      // keep silent to avoid leaking info — show confirmation UI regardless
      setSubmitted(true);
    }
  }

  return (
    <div className="h-screen center-screen bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1
            className="text-3xl font-bold text-center text-[var(--text)]"
            style={{ fontFamily: "Fredoka" }}
          >
            Mot de passe oublié
          </h1>
          <p className="text-sm text-center text-gray-500 mt-2">
            Entrez l'adresse email associée à votre compte pour recevoir un lien
            de réinitialisation.
          </p>
        </div>

        {!submitted ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FocusRing>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Adresse email"
                    onInput={() => {}}
                    error={errors.email?.message}
                    className="h-12"
                  />
                )}
              />
            </FocusRing>

            <Button
              type="submit"
              variant="cta"
              className="h-12 font-semibold text-base"
              disabled={!isValid}
              aria-disabled={!isValid}
            >
              Envoyer le lien
            </Button>
          </form>
        ) : (
          <div className="border border-white/50 p-4 rounded-2xl text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold mb-2">
              Vérifiez votre boîte mail
            </h2>
            <p className="text-sm text-gray-500">
              Si l'adresse existe, un email contenant un lien pour réinitialiser
              votre mot de passe vous a été envoyé.
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 mt-8">
          <NavLink
            to="/login"
            className="text-[var(--text)] font-semibold underline font-quicksand"
          >
            Retour à la connexion
          </NavLink>
          <NavLink
            to="/register"
            className="font-bold mt-4 text-lg font-quicksand"
          >
            Créer un compte
          </NavLink>
        </div>
      </div>
    </div>
  );
}
