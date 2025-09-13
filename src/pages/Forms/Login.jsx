// PAGE LOGIN

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { SUPABASE_LOGO, localLogo } from "../../constants/logo";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get("message");

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

  async function submit(values) {
    try {
      setServerError("");
      const user = await login(values);
      if (user && user.role === "admin") navigate("/admin");
      else navigate("/homepage");
    } catch (error) {
      console.error("Échec de la connexion du formulaire:", error);
      const serverMsg = error?.message || "Échec de la connexion";
      setServerError(serverMsg);
    }
  }

  return (
    <div className="h-screen center-screen bg-[var(--bg)] px-4">
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
          <h1 className="text-4xl font-bold text-center text-[var(--text)]">
            Connexion
          </h1>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
          <FocusRing>
            {/* Email / username */}
            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="data"
                  placeholder="Email ou pseudo"
                  onInput={() => setServerError("")}
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
                  placeholder="Mot de passe"
                  onInput={() => setServerError("")}
                  error={errors.password?.message}
                  className="h-12"
                  maxLength={30}
                />
              )}
            />

            {/* Submit button */}
          </FocusRing>
          <Button
            type="submit"
            variant="cta"
            className="h-12 font-semibold text-base"
          >
            Se connecter
          </Button>
        </form>

        {/* Server error */}
        {serverError && (
          <p className="error-text mt-4 text-center">{serverError}</p>
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
    </div>
  );
}
