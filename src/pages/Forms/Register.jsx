// PAGE INSCRIPTION

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { signUp } from "../../api/auth.api";

import { frenchForbiddenWords } from "../../utils/forbiddenWords";

export default function Register() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const message = params.get("message");

  // Création d'une référence pour s'assurer que le toast n'est affiché qu'une seule fois
  const toastShownRef = useRef(false);

  // Gère les messages de succès ou d'erreur basés sur le paramètre d'URL
  useEffect(() => {
    // On vérifie si le message n'est pas nul ET que le toast n'a pas encore été affiché
    if (message && !toastShownRef.current) {
      if (message === "error") {
        toast.error("Délai dépassé. Veuillez vous réinscrire.", {
          duration: 10000, // Le toast reste visible pendant 10 secondes
        });
      } else if (message === "success") {
        toast.success(
          "Inscription réussie ! Vous allez recevoir un email pour confirmer la création de votre compte.",
          {
            duration: 10000, // Le toast reste visible pendant 10 secondes
          }
        );
      }

      // Une fois le toast affiché, on met à jour la référence
      toastShownRef.current = true;

      // Nettoyer le paramètre d'URL pour éviter que le message se réaffiche au re-render
      setParams({}, { replace: true });
    }
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
        toast.error(
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.postalCode && (
            <p className="text-red-500">{errors.postalCode.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthday && (
            <p className="text-red-500">{errors.birthday.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez...</option>
            <option value="female">Femme</option>
            <option value="male">Homme</option>
            <option value="other">Autre / Je préfère ne pas répondre</option>
          </select>
          {errors.gender && (
            <p className="text-red-500">{errors.gender.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
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
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Conditions */}
        <div className="flex items-start mb-4">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register("agreeToTerms")}
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
              <p className="text-red-500 text-sm mt-1">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>
        </div>

        <NavLink to="/login" className="text-blue-500">
          Déjà inscrit ?
        </NavLink>

        <button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            !isValid ? "opacity-50 cursor-not-allowed hover:bg-blue-500" : ""
          }`}
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
