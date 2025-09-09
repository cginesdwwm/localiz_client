import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadListingImage } from "../../lib/uploadListingImage";
import { createListing } from "../../api/listings.api";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  image: yup.mixed().required("Image requise"),
  locationName: yup.string().required("Lieu requis"),
  type: yup
    .string()
    .oneOf(["donation", "swap"])
    .required("Type de transaction requis"),
  description: yup
    .string()
    .required("Description requise")
    .min(20, "La description doit contenir au moins 20 caractères"),
});

export default function AddListingForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const descriptionValue = watch("description") || "";

  async function onSubmit(values) {
    setLoading(true);
    try {
      const file = values.image[0];
      const imageUrl = await uploadListingImage(file);

      const payload = {
        title: values.locationName,
        images: [imageUrl],
        type: values.type,
        description: values.description,
        location: {
          name: values.locationName,
        },
      };

      await createListing(payload);
      navigate("/listings");
    } catch (err) {
      console.error(err);
      if (err && err.payload && Array.isArray(err.payload.errors)) {
        err.payload.errors.forEach((e) => {
          const param = e.param.includes(".")
            ? e.param.split(".").pop()
            : e.param;
          setError(param, { type: "server", message: e.msg });
        });
      } else {
        alert(err.message || "Erreur");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Image</label>
        <input type="file" {...register("image")} />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}
      </div>

      <div>
        <label>Ville</label>
        <input {...register("locationName")} />
        {errors.locationName && (
          <p className="text-red-500">{errors.locationName.message}</p>
        )}
      </div>

      <div>
        <label>Type</label>
        <select
          {...register("type")}
          className="block w-full border rounded p-2"
        >
          <option value="">Sélectionnez...</option>
          <option value="donation">Don</option>
          <option value="swap">Troc</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea {...register("description")}></textarea>
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <p
          className={`text-sm mt-1 ${
            descriptionValue.length < 20 ? "text-red-500" : "text-gray-500"
          }`}
        >
          {descriptionValue.length} / 20 caractères minimum
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || descriptionValue.length < 20}
        aria-disabled={loading || descriptionValue.length < 20}
        className={`bg-blue-600 text-white px-4 py-2 rounded ${
          loading || descriptionValue.length < 20
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Envoi..." : "Publier l'annonce"}
      </button>

      {descriptionValue.length < 20 && (
        <p className="text-red-600 font-medium mt-2">
          La description doit contenir au moins 20 caractères.
        </p>
      )}
    </form>
  );
}
