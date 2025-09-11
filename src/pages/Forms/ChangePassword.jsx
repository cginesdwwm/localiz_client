// PAGE MODIFIER LE MOT DE PASSE

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";

const schema = yup.object({
  currentPassword: yup.string().required("Ce champ est requis"),
  newPassword: yup
    .string()
    .required("Ce champ est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(30, "Le mot de passe ne peut pas dépasser 30 caractères"),
});

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        notify.success(result.message || "Mot de passe modifié");
        reset();
      } else {
        notify.error(result.message || "Erreur lors du changement");
      }
    } catch (err) {
      console.error(err);
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
            {...register("currentPassword")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.currentPassword && (
            <p className="error-text text-sm mt-1">
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
            {...register("newPassword")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.newPassword && (
            <p className="error-text text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Modifier le mot de passe
        </Button>
      </form>
    </div>
  );
}
