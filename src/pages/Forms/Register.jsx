// PAGE INSCRIPTION

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { notify } from "../../utils/notify";

import { signUp } from "../../api/auth.api";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import Checkbox from "../../components/Common/Checkbox";
import FocusRing from "../../components/Common/FocusRing";

import { frenchForbiddenWords } from "../../utils/forbiddenWords";
import { uploadAvatar } from "../../lib/uploadAvatar";

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
    username: "",
    email: "",
    postalCode: "",
    city: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  };

  // Schéma de validation Yup
  const schema = yup.object({
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
    postalCode: yup.string().required("Le code postal est obligatoire."),
    city: yup
      .string()
      .nullable()
      .max(100, "La ville ne peut pas dépasser 100 caractères.")
      .test(
        "forbidden-words-city",
        "Le nom de la ville contient un mot interdit.",
        (value) => {
          if (!value) return true;
          const lowerCaseValue = value.toLowerCase();
          return !frenchForbiddenWords.some((word) =>
            lowerCaseValue.includes(word.toLowerCase())
          );
        }
      ),
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
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    setError,
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // State for postal code -> towns suggestions
  const [towns, setTowns] = useState([]);
  const [postalQuery, setPostalQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [postalRaw, setPostalRaw] = useState("");
  const [selectedTown, setSelectedTown] = useState("");

  const suggestionsRef = useRef(null);

  // Avatar states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  // Fetch towns when postalQuery is 5 digits (debounced)
  useEffect(() => {
    if (!postalQuery || postalQuery.length !== 5) {
      setTowns([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function fetchTowns() {
      try {
        const res = await fetch(
          `https://geo.api.gouv.fr/communes?codePostal=${postalQuery}&fields=nom,code&format=json`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setTowns([]);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setTowns(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch (err) {
        if (err.name === "AbortError") return;
        setTowns([]);
      } finally {
        // no-op
      }
    }

    const id = setTimeout(fetchTowns, 300);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(id);
    };
  }, [postalQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // cleanup preview URL when file changes
  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  // Fonction de soumission du formulaire
  async function onSubmit(values) {
    try {
      const payload = { ...values };

      // If user selected a local avatar file, upload it first to Supabase
      if (avatarFile) {
        try {
          setAvatarUploading(true);
          const res = await uploadAvatar(avatarFile);
          payload.profilePhoto = res?.path || res?.publicURL || null;
        } catch (err) {
          console.error("Avatar upload failed:", err);
          notify.error("Impossible d'uploader la photo de profil.");
          setAvatarUploading(false);
          return;
        } finally {
          setAvatarUploading(false);
        }
      }

      const data = await signUp(payload);
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
      } else {
        // Pour toutes les autres erreurs, on affiche un toast générique
        notify.error(
          errorMessage || "Une erreur est survenue lors de l'inscription."
        );
      }
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <h1
          className="text-3xl font-bold text-center text-[var(--text)] mb-8"
          style={{ fontFamily: "Fredoka" }}
        >
          Inscription
        </h1>
      </div>
      <form
        className="flex flex-col gap-5 mb-6 mx-auto max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Avatar selector */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="avatar"
            className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-2 cursor-pointer"
            aria-label="Sélectionner une photo de profil"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Prévisualisation avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 font-bold text-2xl">+</div>
            )}
          </label>
          <input
            id="avatar"
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files && e.target.files[0];
              if (!f) return;
              // basic client-side validation: file size limit 5MB
              if (f.size > 5 * 1024 * 1024) {
                notify.error("La photo doit faire moins de 5MB.");
                e.target.value = null;
                return;
              }
              setAvatarFile(f);
              // set a placeholder form value (will be replaced by uploaded URL on submit)
              setValue("profilePhoto", "");
            }}
          />
          <div className="text-sm text-muted">Photo de profil</div>
          {avatarUploading && (
            <div className="text-sm text-primary mt-1">Upload en cours...</div>
          )}
        </div>
        <FocusRing>
          {/* Pseudo */}
          <div className="flex flex-col">
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="username"
                  placeholder="Pseudo"
                  aria-label="Pseudo"
                  onInput={() => {}}
                  error={errors.username?.message}
                  minLength={4}
                  maxLength={20}
                />
              )}
            />
            <p className="text-sm text-gray-500 mb-6">
              Attention : vous ne pourrez pas modifier votre pseudo par la
              suite. Pour toute demande de changement, il vous faudra contacter
              le support.
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="Adresse email"
                  aria-label="Adresse email"
                  onInput={() => {}}
                  error={errors.email?.message}
                />
              )}
            />
          </div>

          {/* Code postal */}
          <div className="flex flex-col">
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => {
                const raw = field.value || "";
                const cleaned = String(raw).replace(/\D/g, "").slice(0, 5);

                return (
                  <Input
                    id="postalCode"
                    // show postal + selected town inside the same input when chosen
                    value={
                      selectedTown
                        ? `${postalRaw} ${selectedTown}`
                        : postalRaw !== ""
                        ? postalRaw
                        : cleaned
                    }
                    // keep form state as raw digits (cleaned) but preserve the user's visible input
                    onChange={(e) => {
                      const rawInput = String(e.target.value);
                      // typing clears any previously selected town
                      if (selectedTown) {
                        setSelectedTown("");
                        setValue("city", "");
                      }
                      setPostalRaw(rawInput);
                      const next = rawInput.replace(/\D/g, "").slice(0, 5);
                      field.onChange(next);
                      setPostalQuery(next);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    type="text"
                    placeholder="Code postal"
                    aria-label="Code postal"
                    error={errors.postalCode?.message}
                    className="h-12"
                  />
                );
              }}
            />
          </div>

          {/* Suggestions dropdown (attached to postal code) */}
          <div className="relative" ref={suggestionsRef}>
            {showSuggestions && towns && towns.length > 0 && (
              <ul className="absolute z-20 left-0 right-0 mt-2 bg-white text-black rounded border max-h-56 overflow-auto">
                {towns.map((t) => (
                  <li
                    key={t.code}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      // set both postalCode and city in the form
                      setValue("postalCode", postalQuery);
                      setValue("city", t.nom);
                      setSelectedTown(t.nom);
                      setShowSuggestions(false);
                    }}
                  >
                    {t.nom}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Hidden field to ensure selected city is part of form values */}
          <Controller
            name="city"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />

          {/* Date de naissance */}
          <div className="flex flex-col">
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="birthday"
                  type="date"
                  placeholder="Date de naissance"
                  aria-label="Date de naissance"
                  onInput={() => {}}
                  error={errors.birthday?.message}
                />
              )}
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col mt-4">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="Mot de passe"
                  aria-label="Mot de passe"
                  onInput={() => {}}
                  error={errors.password?.message}
                  minLength={8}
                  maxLength={30}
                />
              )}
            />
          </div>

          {/* Confirmation */}
          <div className="flex flex-col">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  aria-label="Confirmer le mot de passe"
                  onInput={() => {}}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </div>

          {/* Conditions */}
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="agreeToTerms"
                    ariaLabel={
                      "J'accepte les conditions générales et la politique de confidentialité"
                    }
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    aria-required="true"
                    aria-invalid={errors.agreeToTerms ? "true" : "false"}
                    aria-describedby={
                      errors.agreeToTerms ? "agreeToTerms-error" : undefined
                    }
                  />
                </div>
                <div className="ml-3 text-sm">
                  <div>
                    J'ai lu et j'accepte les{" "}
                    <a href="/legal#cgu" className="underline">
                      conditions générales
                    </a>{" "}
                    et la{" "}
                    <a href="/legal#privacy" className="underline">
                      politique de confidentialité
                    </a>
                    .
                  </div>
                  {errors.agreeToTerms && (
                    <p
                      id="agreeToTerms-error"
                      className="error-text text-sm mt-1"
                    >
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          />
        </FocusRing>
        <Button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          aria-label="S'inscrire"
          className={`m-2 ${!isValid ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          S'inscrire
        </Button>

        <div className="mt-4 text-center">
          <NavLink
            to="/login"
            className="font-bold text-lg inline-block leading-tight font-quicksand"
          >
            Déjà inscrit·e ?
          </NavLink>
        </div>
      </form>
    </div>
  );
}
