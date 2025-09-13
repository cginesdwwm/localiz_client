import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";

const schema = yup.object({
  name: yup.string().required("Le nom est requis"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  message: yup
    .string()
    .min(20, "Le message est trop court")
    .required("Le message est requis"),
});

export default function Contact() {
  const [serverMsg, setServerMsg] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), mode: "onBlur" });

  async function onSubmit(values) {
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(
          payload?.message || "Erreur lors de l'envoi du message"
        );
      }
      setServerMsg("Message envoyé — nous vous répondrons bientôt.");
    } catch (err) {
      setServerMsg(err.message || "Impossible d'envoyer le message");
    }
  }

  return (
    <div className="h-screen center-screen bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-semibold text-center text-[var(--text)]">
            Contactez-nous
          </h1>
          <p className="text-sm text-[var(--muted)] mt-2 text-center">
            Une question, une suggestion ou un problème ? Envoyez-nous un
            message.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FocusRing>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Votre nom"
                  error={errors.name?.message}
                  className="h-12"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  placeholder="Votre email"
                  type="email"
                  error={errors.email?.message}
                  className="h-12"
                />
              )}
            />

            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    id="message"
                    {...field}
                    placeholder="Votre message"
                    rows={6}
                    className="w-full rounded border px-3 py-2 text-sm input-surface placeholder-muted placeholder:text-[15px] resize-vertical"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs mt-1 error-text">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              )}
            />
          </FocusRing>

          <Button
            type="submit"
            variant="cta"
            className="h-12 font-semibold text-base"
            disabled={isSubmitting}
          >
            Envoyer
          </Button>
        </form>

        {serverMsg && (
          <p className="mt-1 text-center text-sm" role="status">
            {serverMsg}
          </p>
        )}
      </div>
    </div>
  );
}
