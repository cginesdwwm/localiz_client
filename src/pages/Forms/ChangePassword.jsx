// PAGE MODIFIER LE MOT DE PASSE

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify } from "../../utils/notify";

export default function ChangePassword() {
  // Initialisation du formulaire avec react-hook-form
  // `register` permet d'enregistrer les champs du formulaire.
  // `handleSubmit` gère la soumission du formulaire.
  // `formState.errors` contient les erreurs de validation.
  // `reset` réinitialise le formulaire après la soumission réussie.
  // Schéma Yup pour la validation du formulaire
  const schema = yup.object({
    currentPassword: yup.string().required("Ce champ est requis"),
    newPassword: yup
      .string()
      .required("Ce champ est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(30, "Le mot de passe ne peut pas dépasser 30 caractères"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  /**
   * Fonction de soumission du formulaire.
   * Elle est appelée par `handleSubmit` si le formulaire est valide.
   * object data : Les données du formulaire (currentPassword, newPassword).
   */
  const onSubmit = async (data) => {
    try {
      // Envoi d'une requête PUT à l'API pour mettre à jour le mot de passe.
      // L'endpoint est protégé par le middleware authMiddleware.
      const response = await fetch("/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Pas besoin de passer le token ici, car le navigateur gère les cookies `httpOnly`.
        },
        body: JSON.stringify(data), // Envoie les mots de passe au serveur
      });

      const result = await response.json();

      // Gestion de la réponse du serveur
      if (response.ok) {
        notify.success(result.message); // Affiche une notification de succès
        reset(); // Réinitialise le formulaire
      } else {
        notify.error(result.message); // Affiche une notification d'erreur
      }
    } catch (error) {
      console.error(error);
      notify.error("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Modifier le mot de passe
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            type="password"
            // Enregistre l'input sous le nom "currentPassword"
            {...register("currentPassword", {
              required: "Ce champ est requis",
            })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Affiche le message d'erreur de validation si le champ est manquant */}
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            // Enregistre l'input sous le nom "newPassword"
            {...register("newPassword", { required: "Ce champ est requis" })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Affiche le message d'erreur de validation */}
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Modifier le mot de passe
        </button>
      </form>
    </div>
  );
}
