import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadDealImage } from "../../lib/uploadDealImage";
import { createDeal } from "../../api/deals.api";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";

const schema = yup.object({
  image: yup.mixed().required("Image requise"),
  title: yup.string().required("Titre requis"),
  address: yup.string().required("Adresse requise"),
  startDate: yup.string().required("Date de début requise"),
  endDate: yup.string().nullable(),
  accessConditionsType: yup
    .string()
    .oneOf(["free", "paid", "reservation", "reduction"])
    .required("Choix requis"),
  price: yup.number().when("accessConditionsType", {
    is: "paid",
    then: (schema) => schema.required("Prix requis").min(0, "Prix invalide"),
    otherwise: (schema) => schema.nullable(),
  }),
  reservationInfo: yup.string().nullable(),
  reductionConditions: yup.string().nullable(),
  website: yup.string().url("URL invalide").nullable(),
  description: yup
    .string()
    .required("Description requise")
    .min(20, "La description doit contenir au moins 20 caractères"),
});

export default function AddDealForm() {
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
  const accessType = watch("accessConditionsType");
  const descriptionValue = watch("description") || "";

  async function onSubmit(values) {
    setLoading(true);
    try {
      const file = values.image[0];
      const imageUrl = await uploadDealImage(file);

      const payload = {
        image: imageUrl,
        title: values.title,
        startDate: values.startDate,
        endDate: values.endDate || null,
        description: values.description,
        location: {
          name: values.locationName || null,
          address: values.address || null,
          zone: values.zone || null,
        },
        accessConditions: (() => {
          const type = values.accessConditionsType;
          if (type === "paid") return { type: "paid", price: values.price };
          if (type === "reservation") return { type: "reservation" };
          if (type === "reduction") return { type: "reduction" };
          return { type: "free" };
        })(),
        website: values.website || null,
      };

      await createDeal(payload);
      navigate("/deals");
    } catch (err) {
      console.error(err);
      // If server sent validation errors in the express-validator format
      if (err && err.payload && Array.isArray(err.payload.errors)) {
        err.payload.errors.forEach((e) => {
          // e.param is the field name (e.g. 'description' or 'accessConditions.price')
          // map nested names to form fields: accessConditions.price -> price
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
          <label>Titre</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                error={errors.title?.message}
              />
            )}
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        <div>
          <label>Lieu</label>
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
        </div>
        <div>
          <label>Adresse</label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                error={errors.address?.message}
              />
            )}
          />
        </div>

        <div>
          <label>Date de début</label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className="w-full"
                error={errors.startDate?.message}
              />
            )}
          />
          {errors.startDate && (
            <p className="error-text">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label>Date de fin (optionnelle)</label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className="w-full"
                error={errors.endDate?.message}
              />
            )}
          />
        </div>

        <div>
          <label>Conditions d'accès</label>
          <select
            {...register("accessConditionsType")}
            className="block w-full border rounded p-2"
          >
            <option value="">Sélectionnez...</option>
            <option value="free">Entrée libre</option>
            <option value="paid">Entrée payante</option>
            <option value="reservation">Réservation</option>
            <option value="reduction">Réduction sous condition(s)</option>
          </select>
          {errors.accessConditionsType && (
            <p className="error-text">{errors.accessConditionsType.message}</p>
          )}

          {accessType === "paid" && (
            <div className="mt-2">
              <label>Prix (€)</label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    className="block w-full"
                    error={errors.price?.message}
                  />
                )}
              />
              {errors.price && (
                <p className="error-text">{errors.price.message}</p>
              )}
            </div>
          )}

          {/* Pour les types 'reservation' et 'reduction' l'utilisateur précise les détails dans la description */}
          {(accessType === "reservation" || accessType === "reduction") && (
            <p className="text-sm text-gray-600 mt-2">
              Si vous avez choisi{" "}
              <strong>
                {accessType === "reservation" ? "Réservation" : "Réduction"}
              </strong>
              , merci de préciser les détails (horaires, contact, conditions de
              réduction, etc.) dans la description ci-dessous.
            </p>
          )}
        </div>

        <div>
          <label>Site web</label>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                error={errors.website?.message}
              />
            )}
          />
          {errors.website && (
            <p className="error-text">{errors.website.message}</p>
          )}
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
                  placeholder={
                    accessType === "reservation" || accessType === "reduction"
                      ? "Veillez à bien préciser les détails de réservation/réduction (horaires, contact, conditions...)"
                      : ""
                  }
                  className="w-full rounded border px-3 py-2 text-sm input-surface placeholder-muted placeholder:text-[15px] resize-vertical"
                ></textarea>
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
          {loading ? "Envoi..." : "Publier l'offre"}
        </Button>
      </FocusRing>

      {descriptionValue.length < 20 && (
        <p className="error-text font-medium mt-2">
          La description doit contenir au moins 20 caractères.
        </p>
      )}
    </form>
  );
}
