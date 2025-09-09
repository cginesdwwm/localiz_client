// PAGE LOGIN

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext"; // Import du hook

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // On récupère la fonction de connexion du contexte
  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get("message");

  // S'occupe du message de succès lors de la redirection de vérification d'email
  useEffect(() => {
    if (message === "success") {
      toast.success(
        "Inscription confirmée ! Vous pouvez maintenant vous connecter.",
        { duration: 8000 }
      );
      // nettoie le query param pour éviter de ré-afficher le toast si on reste sur la page
      setSearchParams({}, { replace: true });
    }
  }, [message, setSearchParams]);

  const defaultValues = {
    data: "",
    password: "",
  };

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

  async function submit(values) {
    try {
      await login(values); // Utilisation de la fonction de connexion du contexte
      navigate("/homepage"); // Rediriger après une connexion réussie
    } catch (error) {
      // Le toast est déjà géré par AuthContext, donc pas besoin de le répéter ici.
      console.error("Échec de la connexion du formulaire:", error);
    }
  }

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-xl rounded">
      <form
        className="flex flex-col gap-4 mb-6 mx-auto max-w-[400px]"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex flex-col mb-2">
          <label htmlFor="data" className="mb-2">
            Pseudo ou Email
          </label>
          <input
            {...register("data")}
            type="text"
            id="data"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.data && <p className="text-red-500">{errors.data.message}</p>}
        </div>
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
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          Se connecter
        </button>
      </form>
      <div className="text-center mt-4">
        <NavLink
          to="/register"
          className="text-sm text-blue-500 hover:underline"
        >
          Pas encore inscrit ?
        </NavLink>
      </div>
    </div>
  );
}
