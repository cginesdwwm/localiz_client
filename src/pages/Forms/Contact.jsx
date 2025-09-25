import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import { notify } from "../../utils/notify";
import { BASE_URL } from "../../utils/url";
import BackLink from "../../components/Common/BackLink";
import { useAuth } from "../../context/AuthContext";

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
  // const [serverMsg, setServerMsg] = useState("");
  const headingRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: {
      errors,
      isSubmitting,
      submitCount,
      dirtyFields,
      touchedFields,
    },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const messageValue = watch("message") || "";
  const nameValue = watch("name") || "";
  const emailValue = watch("email") || "";
  const subjectValue = watch("subject") || "";
  const showEmailSummary = !!errors.email && submitCount > 0;

  // Auto-fill name from authenticated user's username (without overriding user input)
  useEffect(() => {
    if (
      isAuthenticated &&
      user?.username &&
      !dirtyFields?.name &&
      !touchedFields?.name &&
      !nameValue
    ) {
      setValue("name", user.username, { shouldDirty: false });
    }
  }, [
    isAuthenticated,
    user?.username,
    setValue,
    dirtyFields?.name,
    touchedFields?.name,
    nameValue,
  ]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function onSubmit(values) {
    // setServerMsg("");
    try {
      const res = await fetch(`${BASE_URL}/contact`, {
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
      // On success: show toast only (no inline success text) and clear fields
      notify.success("Message envoyé — nous vous répondrons bientôt.");
      // reset form fields (prefill name with username if user is logged in)
      reset({
        name: isAuthenticated && user?.username ? user.username : "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      const m = err.message || "Impossible d'envoyer le message";
      notify.error(m);
    }
  }

  return (
    <section
      aria-labelledby="contact-title"
      className="min-h-screen bg-[var(--bg)] px-4 py-8"
    >
      <div className="w-full max-w-md mx-auto">
        <BackLink to="/homepage" fixed />
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
          <FocusRing>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  label="Nom ou Pseudo Localiz"
                  placeholder="Nom ou pseudo"
                  required
                  autoComplete="name"
                  className="h-12"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    id="email"
                    label="Email"
                    placeholder="Email"
                    type="email"
                    required
                    autoComplete="email"
                    className="h-12"
                  />
                </div>
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
                    Message *
                  </label>
                  <textarea
                    id="message"
                    {...field}
                    placeholder="Message"
                    rows={6}
                    className="w-full border px-3 py-2 text-sm input-surface placeholder-muted placeholder:text-[15px] resize-vertical"
                    aria-describedby="message-hint"
                    required
                    autoComplete="off"
                  />
                  <div className="mt-1 flex items-center justify-between">
                    <p
                      id="message-hint"
                      className="text-sm text-[var(--muted)]"
                    >
                      Minimum 20 caractères
                    </p>
                    <p
                      className="text-sm text-[var(--muted)]"
                      aria-live="polite"
                    >
                      {messageValue.length} / 20
                    </p>
                  </div>
                </div>
              )}
            />
          </FocusRing>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="cta"
              className="h-12 font-semibold text-base"
              disabled={
                isSubmitting ||
                !nameValue.trim() ||
                !emailValue.trim() ||
                !subjectValue.trim() ||
                messageValue.trim().length < 20
              }
            >
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
