// PAGE INSCRIPTION

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { notify } from "../../utils/notify";

import { signUp } from "../../api/auth.api";
import Button from "../../components/Common/Button";

import { frenchForbiddenWords } from "../../utils/forbiddenWords";

export default function Register() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const message = params.get("message");

  // Garde globale (sessionStorage) pour éviter les toasts dupliqués
  // qui peuvent survenir en développement avec React StrictMode
  const TOAST_KEY = "register_message_handled";

  // Gère les messages de succès ou d'erreur basés sur le paramètre d'URL
  useEffect(() => {
    if (!message) return;

    // Si un autre instance a déjà géré le message, on nettoie l'URL et on quitte
    try {
      const handled = sessionStorage.getItem(TOAST_KEY);
      if (handled) {
        setParams({}, { replace: true });
        return;
      }
    } catch {
      // ignore sessionStorage errors
    }

    if (message === "error") {
      notify.error("Délai dépassé. Veuillez vous réinscrire.", {
        duration: 10000, // Le toast reste visible pendant 10 secondes
      });
    } else if (message === "success") {
      notify.success(
        "Inscription réussie ! Vous allez recevoir un email pour confirmer la création de votre compte.",
        {
          duration: 10000, // Le toast reste visible pendant 10 secondes
        }
      );
    }

    // Marquer comme géré pour éviter un second toast par une autre instance
    try {
      sessionStorage.setItem(TOAST_KEY, "1");
      // Nettoyage du marqueur après quelques secondes pour ne pas bloquer de futurs messages
      setTimeout(() => {
        try {
          sessionStorage.removeItem(TOAST_KEY);
        } catch {
          void 0;
        }
      }, 5000);
    } catch {
      // ignore
    }

    // Nettoyer le paramètre d'URL pour éviter que le message se réaffiche au re-render
    setParams({}, { replace: true });
  }, [message, setParams]);

  // Valeurs par défaut du formulaire pour initialisation
  const defaultValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    postalCode: "",
    birthday: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  };

  // Schéma de validation Yup
  const schema = yup.object({
    firstName: yup
      .string()
      .required("Le prénom est obligatoire.")
      .min(2, "Le prénom doit faire au moins 2 caractères.")
      .test(
        "forbidden-words",
        "Ce prénom contient un mot interdit.",
        (value) => {
          // Validation avec la liste de mots importée
          if (!value) return true;
          const lowerCaseValue = value.toLowerCase();
          return !frenchForbiddenWords.some((word) =>
            lowerCaseValue.includes(word.toLowerCase())
          );
        }
      )
      .matches(
        /^[a-zA-ZÀ-ÿ'-]+(?:\s[a-zA-ZÀ-ÿ'-]+)*$/,
        "Ce champ ne peut contenir que des lettres, des tirets et des apostrophes."
      ),
    lastName: yup
      .string()
      .required("Le nom est obligatoire.")
      .min(2, "Le nom doit faire au moins 2 caractères.")
      .test("forbidden-words", "Ce nom contient un mot interdit.", (value) => {
        // Validation avec la liste de mots importée
        if (!value) return true;
        const lowerCaseValue = value.toLowerCase();
        return !frenchForbiddenWords.some((word) =>
          lowerCaseValue.includes(word.toLowerCase())
        );
      })
      .matches(
        /^[a-zA-ZÀ-ÿ'-]+(?:\s[a-zA-ZÀ-ÿ'-]+)*$/,
        "Ce champ ne peut contenir que des lettres, des tirets et des apostrophes."
      ),
    username: yup
      .string()
      .required("Le pseudo est obligatoire.")
      .min(4, "Le pseudo doit faire au moins 4 caractères")
      .max(20, "Le pseudo doit faire au maximum 20 caractères")
      .test(
        "forbidden-words",
        "Ce nom d'utilisateur contient un mot interdit.",
        (value) => {
          // Validation avec la liste de mots importée
          if (!value) return true;
          const lowerCaseValue = value.toLowerCase();
          return !frenchForbiddenWords.some((word) =>
            lowerCaseValue.includes(word.toLowerCase())
          );
        }
      )
      .matches(
        /^[a-zA-Z0-9_-]{4,20}$/,
        "Le nom d'utilisateur doit contenir entre 4 et 20 caractères alphanumériques, des tirets ou des underscores."
      ),
    email: yup
      .string()
      .email("Format email non valide.")
      .required("L'email est obligatoire.")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Format email non valide."),
    phone: yup
      .string()
      .required("Le numéro de téléphone est obligatoire.")
      .matches(/^\d{10}$/, "Format de numéro de téléphone non valide."),
    postalCode: yup
      .string()
      .required("Le code postal est obligatoire.")
      .matches(/^\d{5}$/, "Format de code postal non valide."),
    birthday: yup
      .date()
      .typeError("Veuillez entrer une date valide.")
      .required("La date de naissance est obligatoire.")
      .max(new Date(), "La date de naissance doit être dans le passé.")
      .test(
        "min-age",
        "Vous devez avoir au moins 16 ans pour vous inscrire.",
        (value) => {
          if (!value) return false;
          const cutoff = new Date();
          cutoff.setFullYear(cutoff.getFullYear() - 16);
          return value <= cutoff;
        }
      ),
    gender: yup
      .string()
      .required("Le genre est obligatoire.")
      .oneOf(
        ["female", "male", "other"],
        "Veuillez choisir l'une des options."
      ),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire.")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .max(30, "Le mot de passe ne peut pas dépasser 30 caractères.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.{8,30})/,
        "Le mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial."
      ),
    confirmPassword: yup
      .string()
      .required("La confirmation de mot de passe est obligatoire.")
      .oneOf(
        [yup.ref("password"), null],
        "Les mots de passe ne correspondent pas"
      ),
    agreeToTerms: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les conditions pour continuer."),
  });

  // Initialisation du formulaire avec react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Fonction de soumission du formulaire
  async function onSubmit(values) {
    try {
      const data = await signUp(values);
      // Récupère expiresAt envoyé par le serveur (timestamp ms)
      const expiresAt = data?.expiresAt;
      // Persister l'expiration en sessionStorage afin de survivre à un reload
      try {
        if (expiresAt) {
          sessionStorage.setItem("register_expiresAt", String(expiresAt));
        } else {
          sessionStorage.removeItem("register_expiresAt");
        }
      } catch {
        // Ignorer si l'accès à sessionStorage échoue
      }

      // Après inscription réussie, rediriger vers la page d'information
      // en passant expiresAt dans location.state pour un compte à rebours exact.
      navigate("/register/success", { replace: true, state: { expiresAt } });
      reset(defaultValues);
    } catch (error) {
      // Ce bloc est exécuté si une erreur est lancée par `signUp`
      console.error("Erreur onSubmit:", error);
      const errorMessage = error.message;

      // Test des messages d'erreur spécifiques du backend pour appeler setError
      if (errorMessage.includes("Le pseudo est déjà utilisé.")) {
        setError("username", {
          type: "manual",
          message: errorMessage,
        });
      } else if (errorMessage.includes("L'email est déjà utilisé.")) {
        setError("email", {
          type: "manual",
          message: errorMessage,
        });
      } else if (
        errorMessage.includes("Le numéro de téléphone est déjà utilisé.")
      ) {
        setError("phone", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        // Pour toutes les autres erreurs, on affiche un toast générique
        notify.error(
          errorMessage || "Une erreur est survenue lors de l'inscription."
        );
      }
    }
  }

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-xl rounded">
      <form
        className="flex flex-col gap-4 mb-6 mx-auto max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Prénom */}
        <div className="flex flex-col mb-2">
          <label htmlFor="firstName" className="mb-2">
            Prénom
          </label>
          <input
            {...register("firstName")}
            type="text"
            id="firstName"
            aria-required="true"
            aria-invalid={errors.firstName ? "true" : "false"}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p id="firstName-error" className="error-text">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Nom */}
        <div className="flex flex-col mb-2">
          <label htmlFor="lastName" className="mb-2">
            Nom
          </label>
          <input
            {...register("lastName")}
            type="text"
            id="lastName"
            aria-required="true"
            aria-invalid={errors.lastName ? "true" : "false"}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p id="lastName-error" className="error-text">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Pseudo */}
        <div className="flex flex-col mb-2">
          <label htmlFor="username" className="mb-2">
            Pseudo
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            aria-required="true"
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p id="username-error" className="error-text">
              {errors.username.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Attention : votre pseudo ne pourra pas être modifié par la suite.
            Pour toute demande de changement, il vous faudra contacter le
            support.
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col mb-2">
          <label htmlFor="email" className="mb-2">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p id="email-error" className="error-text">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Téléphone */}
        <div className="flex flex-col mb-2">
          <label htmlFor="phone" className="mb-2">
            Téléphone
          </label>
          <input
            {...register("phone")}
            type="text"
            id="phone"
            aria-required="true"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p id="phone-error" className="error-text">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Code postal */}
        <div className="flex flex-col mb-2">
          <label htmlFor="postalCode" className="mb-2">
            Code postal
          </label>
          <input
            {...register("postalCode")}
            type="text"
            id="postalCode"
            aria-required="true"
            aria-invalid={errors.postalCode ? "true" : "false"}
            aria-describedby={
              errors.postalCode ? "postalCode-error" : undefined
            }
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.postalCode && (
            <p id="postalCode-error" className="error-text">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        {/* Date de naissance */}
        <div className="flex flex-col mb-2">
          <label htmlFor="birthday" className="mb-2">
            Date de naissance
          </label>
          <input
            {...register("birthday")}
            type="date"
            id="birthday"
            aria-required="true"
            aria-invalid={errors.birthday ? "true" : "false"}
            aria-describedby={errors.birthday ? "birthday-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthday && (
            <p id="birthday-error" className="error-text">
              {errors.birthday.message}
            </p>
          )}
        </div>

        {/* Genre */}
        <div className="flex flex-col mb-2">
          <label htmlFor="gender" className="mb-2">
            Genre
          </label>
          <select
            {...register("gender")}
            id="gender"
            aria-required="true"
            aria-invalid={errors.gender ? "true" : "false"}
            aria-describedby={errors.gender ? "gender-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez...</option>
            <option value="female">Femme</option>
            <option value="male">Homme</option>
            <option value="other">Autre / Je préfère ne pas répondre</option>
          </select>
          {errors.gender && (
            <p id="gender-error" className="error-text">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="flex flex-col mb-2">
          <label htmlFor="password" className="mb-2">
            Mot de passe
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            aria-required="true"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p id="password-error" className="error-text">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirmation */}
        <div className="flex flex-col mb-2">
          <label htmlFor="confirmPassword" className="mb-2">
            Confirmation du mot de passe
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            aria-required="true"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="error-text">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Conditions */}
        <div className="flex items-start mb-4">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register("agreeToTerms")}
              aria-required="true"
              aria-invalid={errors.agreeToTerms ? "true" : "false"}
              aria-describedby={
                errors.agreeToTerms ? "agreeToTerms-error" : undefined
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
              J'ai lu et j'accepte les{" "}
              <a href="/legal#cgu" className="text-blue-600 hover:underline">
                conditions générales
              </a>{" "}
              et la{" "}
              <a
                href="/legal#privacy"
                className="text-blue-600 hover:underline"
              >
                politique de confidentialité
              </a>
              .
            </label>
            {errors.agreeToTerms && (
              <p id="agreeToTerms-error" className="error-text text-sm mt-1">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>
        </div>

        <NavLink to="/login" className="text-blue-500">
          Déjà inscrit ?
        </NavLink>

        <Button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          aria-label="S'inscrire"
          className={!isValid ? "opacity-50 cursor-not-allowed" : ""}
        >
          S'inscrire
        </Button>
      </form>
    </div>
  );
}
