import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Common/Button";

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
    register,
    handleSubmit,
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
      if (!res.ok) throw new Error("Erreur lors de l'envoi du message");
      setServerMsg("Message envoyé — nous vous répondrons bientôt.");
    } catch (err) {
      setServerMsg(err.message || "Impossible d'envoyer le message");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">
        Quelque chose à nous dire ?
      </h1>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <label className="sr-only" htmlFor="name">
          Nom
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Votre nom"
          className="w-full h-12 bg-[#D9D9D9] placeholder-[#4A4A4A] rounded-[14px] px-6 focus:outline-none text-[#000000] text-base"
        />
        {errors.name && (
          <p className="error-text text-sm">{errors.name.message}</p>
        )}

        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          placeholder="Votre email"
          className="w-full h-12 bg-[#D9D9D9] placeholder-[#4A4A4A] rounded-[14px] px-6 focus:outline-none text-[#000000] text-base"
        />
        {errors.email && (
          <p className="error-text text-sm">{errors.email.message}</p>
        )}

        <label className="sr-only" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Votre message"
          rows={6}
          className="w-full bg-[#D9D9D9] placeholder-[#4A4A4A] rounded-[14px] px-4 py-3 focus:outline-none text-[#000000] text-base resize-vertical"
        />
        {errors.message && (
          <p className="error-text text-sm">{errors.message.message}</p>
        )}

        <Button
          type="submit"
          variant="cta"
          className="w-full h-12"
          disabled={isSubmitting}
        >
          Envoyer
        </Button>
      </form>

      {serverMsg && <p className="mt-4 text-center">{serverMsg}</p>}
    </div>
  );
}
