// PAGE LOGIN

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { SUPABASE_LOGO, localLogo } from "../../constants/logo";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
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
    register,
    handleSubmit,
    formState: { errors },
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
    <div className="bg-transparent">
      <div className="mx-auto w-full max-w-[620px] px-6 py-10 flex flex-col items-center">
        <div className="flex flex-col items-center gap-0">
          <img
            src={SUPABASE_LOGO}
            alt="Localiz logo"
            width={180}
            height={180}
            className="mb-0 block"
            onError={(e) => {
              e.currentTarget.src = localLogo;
            }}
          />

          <h1 className="mt-0 mb-6 text-center">Connexion</h1>
        </div>

        <form
          className="flex flex-col items-center gap-16 w-full h-[400px]"
          onSubmit={handleSubmit(submit)}
        >
          <div className="mb-4">
            <label htmlFor="data" className="sr-only">
              Email ou pseudo
            </label>
            <input
              {...register("data")}
              type="text"
              id="data"
              placeholder="Email ou pseudo"
              aria-required="true"
              aria-invalid={errors.data ? "true" : "false"}
              aria-describedby={errors.data ? "data-error" : undefined}
              onInput={() => setServerError("")}
              className="w-full h-12 bg-[#D9D9D9] placeholder-[#4A4A4A] rounded-[14px] px-6 focus:outline-none text-[#000000] text-base"
            />
            {errors.data && (
              <p id="data-error" className="error-text text-sm mt-1">
                {errors.data.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Mot de passe"
              aria-required="true"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              onInput={() => setServerError("")}
              className="w-full h-12 bg-[#D9D9D9] placeholder-[#4A4A4A] rounded-[14px] px-6 focus:outline-none text-[#000000] text-base"
            />
            {errors.password && (
              <p id="password-error" className="error-text text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="cta"
            className="w-full h-12 font-semibold text-base"
          >
            Se connecter
          </Button>
        </form>

        {serverError && (
          <p className="text-red-600 mt-6 text-center">{serverError}</p>
        )}

        <div className="w-full max-w-full flex flex-col items-center gap-4 mt-10">
          <NavLink
            to="/forgot-password"
            className="font-ui font-semibold text-white text-center underline text-base tracking-[0] leading-[normal]"
          >
            Mot de passe oublié ?
          </NavLink>

          <NavLink
            to="/register"
            className="text-sm text-blue-600 font-semibold text-base no-underline"
          >
            Créer un compte
          </NavLink>
        </div>
      </div>
    </div>
  );
}
