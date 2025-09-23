// PAGE LOGIN

import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { SUPABASE_LOGO, localLogo } from "../../constants/logo";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import ErrorSummary from "../../components/Common/ErrorSummary";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get("message");
  const headingRef = useRef(null);

  useEffect(() => {
    if (message !== "success") return;
    const KEY = "login_message_handled";
    try {
      if (sessionStorage.getItem(KEY)) {
        setSearchParams({}, { replace: true });
        return;
      }
    } catch {
      /* ignore */
    }

    notify.success(
      "Inscription confirmée ! Vous pouvez maintenant vous connecter.",
      { duration: 8000 }
    );

    try {
      sessionStorage.setItem(KEY, "1");
      setTimeout(() => {
        try {
          sessionStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
      }, 5000);
    } catch {
      /* ignore */
    }

    setSearchParams({}, { replace: true });
  }, [message, setSearchParams]);

  const defaultValues = { data: "", password: "" };
  const schema = yup.object({
    data: yup.string().required("Ce champ est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(values) {
    try {
      setIsSubmitting(true);
      setServerError("");
      const user = await login(values);
      if (user && user.role === "admin") navigate("/admin");
      else navigate("/homepage");
    } catch (error) {
      console.error("Échec de la connexion du formulaire:", error);
      const serverMsg = error?.message || "Échec de la connexion";
      setServerError(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby="login-title"
      className="h-screen center-screen bg-[var(--bg)] px-4"
    >
      <div className="w-full max-w-md">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={SUPABASE_LOGO}
            alt="Localiz logo"
            width={180}
            height={180}
            className="mb-4"
            onError={(e) => {
              e.currentTarget.src = localLogo;
            }}
          />
          <h1
            id="login-title"
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-bold text-center text-[var(--text)]"
            style={{ fontFamily: "Fredoka" }}
          >
            Connexion
          </h1>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(submit)}
          aria-busy={isSubmitting || undefined}
          noValidate
        >
          <ErrorSummary
            errors={errors}
            fields={[
              { name: "data", id: "data", label: "Email ou pseudo" },
              { name: "password", id: "password", label: "Mot de passe" },
            ]}
          />
          <FocusRing>
            {/* Email / username */}
            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="data"
                  label="Email ou pseudo"
                  placeholder="Email ou pseudo"
                  onInput={() => setServerError("")}
                  required
                  autoComplete="username email"
                  error={errors.data?.message}
                  className="h-12"
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type="password"
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  onInput={() => setServerError("")}
                  error={errors.password?.message}
                  className="h-12"
                  maxLength={30}
                  required
                  autoComplete="current-password"
                />
              )}
            />

            {/* Submit button */}
          </FocusRing>
          <div className="flex justify-center">
            <div className="w-3/4">
              <Button
                type="submit"
                variant="cta"
                className="w-full h-12 font-semibold text-base"
              >
                Se connecter
              </Button>
            </div>
          </div>
        </form>

        {/* Google sign-in removed */}

        {/* Server error */}
        {serverError && (
          <p
            className="error-text mt-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            {serverError}
          </p>
        )}

        {/* Links */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <NavLink
            to="/forgot-password"
            className="text-[var(--text)] font-semibold underline font-quicksand"
          >
            Mot de passe oublié ?
          </NavLink>
          <NavLink
            to="/register"
            className="font-bold mt-4 text-lg font-quicksand"
          >
            Créer un compte
          </NavLink>
        </div>
      </div>
    </section>
  );
}
