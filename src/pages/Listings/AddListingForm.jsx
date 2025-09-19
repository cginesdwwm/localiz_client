import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadListingImage } from "../../lib/uploadListingImage";
import { createListing } from "../../api/listings.api";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";

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
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const descriptionValue = watch("description") || "";

  async function onSubmit(values) {
    setLoading(true);
    try {
      const file = values.image[0];
      const res = await uploadListingImage(file);
      const imageUrl = res?.path || res?.publicURL || null;

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
      <FocusRing>
        <div>
          <label>Image</label>
          <input type="file" {...register("image")} />
          {errors.image && <p className="error-text">{errors.image.message}</p>}
        </div>

        <div>
          <label>Ville</label>
          <Controller
            name="locationName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                error={errors.locationName?.message}
              />
            )}
          />
          {errors.locationName && (
            <p className="error-text">{errors.locationName.message}</p>
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
          {errors.type && <p className="error-text">{errors.type.message}</p>}
        </div>

        <div>
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <textarea
                  {...field}
                  className="w-full rounded border px-3 py-2 text-sm input-surface placeholder-muted placeholder:text-[15px] resize-vertical"
                />
                {errors.description && (
                  <p className="error-text">{errors.description.message}</p>
                )}
              </div>
            )}
          />
          <p
            className={`text-sm mt-1 ${
              descriptionValue.length < 20 ? "error-text" : "text-gray-500"
            }`}
          >
            {descriptionValue.length} / 20 caractères minimum
          </p>
        </div>
      </FocusRing>
      <Button
        type="submit"
        disabled={loading || descriptionValue.length < 20}
        aria-disabled={loading || descriptionValue.length < 20}
        className={
          loading || descriptionValue.length < 20
            ? "opacity-50 cursor-not-allowed"
            : ""
        }
      >
        {loading ? "Envoi..." : "Publier l'annonce"}
      </Button>

      {descriptionValue.length < 20 && (
        <p className="error-text font-medium mt-2">
          La description doit contenir au moins 20 caractères.
        </p>
      )}
    </form>
  );
}
