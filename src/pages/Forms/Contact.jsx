import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import ErrorSummary from "../../components/Common/ErrorSummary";
import { notify } from "../../utils/notify";
import BackLink from "../../components/Common/BackLink";

const schema = yup.object({
  name: yup.string().required("Le nom est requis"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  subject: yup.string().required("L'objet est requis"),
  message: yup
    .string()
    .min(20, "Le message est trop court")
    .required("Le message est requis"),
});

export default function Contact() {
  const [serverMsg, setServerMsg] = useState("");
  const headingRef = useRef(null);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), mode: "onBlur" });

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

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
      const successMsg = "Message envoyé — nous vous répondrons bientôt.";
      setServerMsg(successMsg);
      notify.success(successMsg);
      // reset form fields
      reset();
    } catch (err) {
      const m = err.message || "Impossible d'envoyer le message";
      setServerMsg(m);
      notify.error(m);
    }
  }

  return (
    <section
      aria-labelledby="contact-title"
      className="h-screen center-screen bg-[var(--bg)] px-4"
    >
      <div className="w-full max-w-md">
        <BackLink to="/" fixed />
        <h1
          id="contact-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-bold text-center text-[var(--text)]"
          style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
        >
          Contact
        </h1>
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-semibold text-center text-[var(--text)] mt-1">
            Quelque chose à nous dire ?
          </h2>
          <p className="text-[var(--muted)] mt-1 text-center">
            Une question, une suggestion ou un problème ? On est à l'écoute !
          </p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting || undefined}
          noValidate
        >
          <ErrorSummary
            errors={errors}
            fields={[
              { name: "name", id: "name", label: "Nom" },
              { name: "email", id: "email", label: "Email" },
              { name: "subject", id: "subject", label: "Objet" },
              { name: "message", id: "message", label: "Message" },
            ]}
          />
          <FocusRing>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  label="Nom"
                  placeholder="Nom"
                  required
                  autoComplete="name"
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
                  label="Email"
                  placeholder="Email"
                  type="email"
                  required
                  autoComplete="email"
                  error={errors.email?.message}
                  className="h-12"
                />
              )}
            />

            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="subject"
                  label="Objet"
                  placeholder="Objet du message"
                  required
                  autoComplete="off"
                  error={errors.subject?.message}
                  className="h-12"
                />
              )}
            />

            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...field}
                    placeholder="Message"
                    rows={6}
                    className="w-full border px-3 py-2 text-sm input-surface placeholder-muted placeholder:text-[15px] resize-vertical"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    required
                    autoComplete="off"
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="text-xs mt-1 error-text"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errors.message.message}
                    </p>
                  )}
                </div>
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
              Envoyer
            </Button>
          </div>
        </form>

        {serverMsg && (
          <p
            className="mt-1 text-center text-sm"
            role="status"
            aria-live="polite"
          >
            {serverMsg}
          </p>
        )}
      </div>
    </section>
  );
}
