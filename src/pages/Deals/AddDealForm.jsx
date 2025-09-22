import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadDealImage } from "../../lib/uploadDealImage";
import { createDeal } from "../../api/deals.api";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import BackLink from "../../components/Common/BackLink";

const schema = yup.object({
  image: yup.mixed().required("Image requise"),
  title: yup.string().required("Titre requis"),
  streetAddress: yup
    .string()
    .required("Adresse (rue) requise")
    .min(3, "Adresse trop courte"),
  postalCode: yup
    .string()
    .required("Code postal requis")
    .matches(/^\d{5}$/i, "Code postal invalide"),
  city: yup.string().required("Ville requise"),
  startDate: yup.string().required("Date de début requise"),
  endDate: yup.string().nullable(),
  accessConditionsType: yup
    .string()
    .oneOf(["free", "paid", "reservation", "reduction", "other"])
    .required("Choix requis"),
  price: yup.number().when("accessConditionsType", {
    is: "paid",
    then: (schema) =>
      schema.required("Prix requis").moreThan(0, "Prix invalide"),
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
  const [towns, setTowns] = useState([]);
  const [postalQuery, setPostalQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [postalRaw, setPostalRaw] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const suggestionsRef = useRef(null);
  const streetRef = useRef(null);
  const [streetRaw, setStreetRaw] = useState("");
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState([]); // [{file, url}]

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const accessType = watch("accessConditionsType");
  const descriptionValue = watch("description") || "";
  const imageValue = watch("image");

  async function onSubmit(values) {
    setLoading(true);
    try {
      // Collect selected files (up to 4) and upload all
      const fileInputs = Array.isArray(images) ? images : [];
      if (fileInputs.length === 0) throw new Error("Image requise");
      const uploads = [];
      for (const it of fileInputs) {
        uploads.push(uploadDealImage(it.file));
      }
      const results = await Promise.all(uploads);
      const urls = results
        .map((r) => r?.publicURL || r?.path || null)
        .filter(Boolean);
      const imageUrl = urls[0] || null;
      const extraImages = urls.slice(1);

      const location = {
        address:
          `${values.streetAddress}, ${values.postalCode} ${values.city}`.trim(),
      };
      if (values.locationName)
        location.name = String(values.locationName).trim();
      if (values.zone) location.zone = String(values.zone).trim();

      const payload = {
        image: imageUrl,
        images: extraImages,
        title: values.title,
        startDate: values.startDate,
        endDate: values.endDate || null,
        description: values.description,
        location,
        accessConditions: (() => {
          const type = values.accessConditionsType;
          if (type === "paid") return { type: "paid", price: values.price };
          if (type === "reservation") return { type: "reservation" };
          if (type === "reduction") return { type: "reduction" };
          return { type: "free" };
        })(),
      };
      if (values.website) {
        payload.website = values.website;
      }

      await createDeal(payload);
      navigate("/deals");
    } catch (err) {
      console.error(err);
      // If server sent validation errors in the express-validator format
      if (err && err.payload && Array.isArray(err.payload.errors)) {
        err.payload.errors.forEach((e) => {
          const nameRaw =
            (typeof e.param === "string" && e.param) ||
            (typeof e.path === "string" && e.path) ||
            "";
          const last = nameRaw.includes(".")
            ? nameRaw.split(".").pop()
            : nameRaw;

          // map nested server fields to client form fields
          let target = last;
          if (nameRaw.startsWith("location.")) {
            if (last === "address") target = "streetAddress";
          }
          if (nameRaw.startsWith("accessConditions.")) {
            if (last === "type") target = "accessConditionsType";
          }

          if (target) {
            setError(target, {
              type: "server",
              message: e.msg || e.message || "Erreur",
            });
          }
        });
      } else {
        alert(err.message || "Erreur");
      }
    } finally {
      setLoading(false);
    }
  }

  // Fetch town suggestions for postal code (like Register page)
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
        if (err && err.name === "AbortError") return;
        setTowns([]);
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
      if (streetRef.current && !streetRef.current.contains(e.target)) {
        setShowStreetSuggestions(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Fetch street suggestions (api-adresse.data.gouv.fr)
  useEffect(() => {
    const q = String(streetRaw || "").trim();
    if (q.length < 3) {
      setStreetSuggestions([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function fetchStreets() {
      try {
        const params = new URLSearchParams();
        params.set("q", q);
        if (postalQuery && postalQuery.length === 5)
          params.set("postcode", postalQuery);
        params.set("autocomplete", "1");
        params.set("limit", "8");
        const url = `https://api-adresse.data.gouv.fr/search/?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          setStreetSuggestions([]);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        const feats = Array.isArray(data?.features) ? data.features : [];
        setStreetSuggestions(feats);
        setShowStreetSuggestions(true);
      } catch (err) {
        if (err && err.name === "AbortError") return;
        setStreetSuggestions([]);
      }
    }

    const id = setTimeout(fetchStreets, 250);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(id);
    };
  }, [streetRaw, postalQuery]);

  return (
    <div className="p-4">
      <BackLink to="/publish" fixed />
      <div className="mb-4 text-center">
        <h1
          className="text-3xl font-bold text-center text-[var(--text)] mb-8"
          style={{ fontFamily: "Fredoka" }}
        >
          Publier un bon plan
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mb-6 mx-auto max-w-[400px]"
      >
        <FocusRing>
          {/* Titre */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="title"
                placeholder="Titre du bon plan"
                label="Titre"
                size="base"
                required
                className="w-full"
                error={errors.title?.message}
              />
            )}
          />

          {/* Lieu (nom du lieu ou ville) */}
          <Controller
            name="locationName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="locationName"
                placeholder="L'endroit exact (ex: Nom du commerce, restaurant...)"
                label="Lieu"
                size="base"
                className="w-full"
                required
                error={errors.locationName?.message}
              />
            )}
          />

          {/* Images (max 4) drag & drop */}
          <div className="mb-4">
            <label className="block text-base font-medium">
              Images (jusqu'à 4) *
            </label>
            <p className="text-sm text-gray-600 mb-2">
              La première image de la liste sera utilisée comme couverture de
              l'annonce.
            </p>
            {images.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer bg-card text-[var(--card-text)] ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  const dropped = Array.from(e.dataTransfer.files || []).filter(
                    (f) => f.type?.startsWith("image/")
                  );
                  if (dropped.length) {
                    const current = images || [];
                    const nextItems = dropped.map((f) => ({
                      file: f,
                      url: URL.createObjectURL(f),
                    }));
                    const merged = [...current, ...nextItems].slice(0, 4);
                    setImages(merged);
                    setValue(
                      "image",
                      merged.map((n) => n.file),
                      { shouldValidate: true }
                    );
                  }
                }}
                onClick={() =>
                  document.getElementById("deal-image-input")?.click()
                }
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="text-base font-medium text-gray-700">
                    Glissez vos images ici
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour parcourir vos fichiers (PNG, JPG, JPEG)
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50"
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const dropped = Array.from(e.dataTransfer.files || []).filter(
                    (f) => f.type?.startsWith("image/")
                  );
                  if (dropped.length) {
                    const current = images || [];
                    const nextItems = dropped.map((f) => ({
                      file: f,
                      url: URL.createObjectURL(f),
                    }));
                    const merged = [...current, ...nextItems].slice(0, 4);
                    setImages(merged);
                    setValue(
                      "image",
                      merged.map((n) => n.file),
                      { shouldValidate: true }
                    );
                  }
                }}
              >
                <div className="flex flex-wrap gap-3">
                  {images.map((it, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={it.url}
                        alt={`Prévisualisation ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        aria-label="Retirer"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center"
                        onClick={() => {
                          const next = images.filter((_, i) => i !== idx);
                          // revoke URL for removed
                          try {
                            URL.revokeObjectURL(images[idx].url);
                          } catch {}
                          setImages(next);
                          if (next.length === 0) {
                            setValue("image", null, { shouldValidate: true });
                          } else {
                            setValue(
                              "image",
                              next.map((n) => n.file),
                              { shouldValidate: true }
                            );
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {images.length < 4 && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-4 py-2"
                      onClick={() =>
                        document.getElementById("deal-image-input")?.click()
                      }
                    >
                      Ajouter d'autres images
                    </Button>
                  </div>
                )}
              </div>
            )}
            {/* Hidden input is always present to allow adding more images */}
            <input
              id="deal-image-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const incoming = Array.from(e.target.files || []).filter((f) =>
                  f.type?.startsWith("image/")
                );
                if (incoming.length) {
                  const current = images || [];
                  const nextItems = incoming.map((f) => ({
                    file: f,
                    url: URL.createObjectURL(f),
                  }));
                  const merged = [...current, ...nextItems].slice(0, 4);
                  setImages(merged);
                  setValue(
                    "image",
                    merged.map((n) => n.file),
                    { shouldValidate: true }
                  );
                }
                // allow selecting the same files again
                e.target.value = "";
              }}
            />
            {errors.image && (
              <p id="image-error" className="text-xs mt-1 error-text">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Adresse */}
          <div className="mb-2" ref={streetRef}>
            <Controller
              name="streetAddress"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="streetAddress"
                  placeholder="N° et rue (ex: 10 Rue de Paris)"
                  label="Adresse"
                  size="base"
                  required
                  className="w-full"
                  error={errors.streetAddress?.message}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setStreetRaw(e.target.value);
                  }}
                />
              )}
            />
            {showStreetSuggestions && streetSuggestions.length > 0 && (
              <ul className="mt-[-8px] mb-2 bg-white text-black border rounded max-h-56 overflow-auto">
                {streetSuggestions.map((f) => {
                  const p = f?.properties || {};
                  const label = p.label || "";
                  const streetOnly = p.name || String(label).split(",")[0];
                  return (
                    <li
                      key={p.id || label}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const street = streetOnly || label;
                        setValue("streetAddress", street, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setStreetRaw(street);
                        if (p.postcode) {
                          setValue("postalCode", p.postcode, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setPostalRaw(p.postcode);
                          setPostalQuery(p.postcode);
                        }
                        if (p.city) {
                          setValue("city", p.city, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setSelectedTown(p.city);
                        }
                        setShowStreetSuggestions(false);
                      }}
                    >
                      {label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Adresse (Code postal + Ville) */}
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
                    value={
                      selectedTown
                        ? `${postalRaw} ${selectedTown}`
                        : postalRaw !== ""
                        ? postalRaw
                        : cleaned
                    }
                    onChange={(e) => {
                      const rawInput = String(e.target.value);
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
                    label="Code postal"
                    size="base"
                    required
                    error={errors.postalCode?.message}
                    className="h-12"
                  />
                );
              }}
            />

            {/* Suggestions dropdown for towns */}
            <div className="relative" ref={suggestionsRef}>
              {showSuggestions && towns && towns.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 mt-2 bg-white text-black border rounded max-h-56 overflow-auto">
                  {towns.map((t) => (
                    <li
                      key={t.code}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setValue("postalCode", postalQuery, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("city", t.nom, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setSelectedTown(t.nom);
                        setPostalRaw(postalQuery);
                        setShowSuggestions(false);
                      }}
                    >
                      {t.nom}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Hidden city field */}
          <Controller
            name="city"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />

          {/* Dates */}
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="startDate"
                type="date"
                label="Date de début"
                size="base"
                required
                className="w-full"
                error={errors.startDate?.message}
              />
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="endDate"
                type="date"
                label="Date de fin (optionnelle)"
                size="base"
                className="w-full"
                error={errors.endDate?.message}
              />
            )}
          />

          {/* Conditions d'accès */}
          <div className="mb-2">
            <label
              htmlFor="accessConditionsType"
              className="block text-base font-medium mb-1"
            >
              Conditions d'accès <span className="text-red-500">*</span>
            </label>
            <select
              id="accessConditionsType"
              {...register("accessConditionsType")}
              className="w-full border px-3 py-2 input-surface h-12 text-base"
              aria-invalid={!!errors.accessConditionsType}
              aria-describedby={
                errors.accessConditionsType
                  ? "accessConditionsType-error"
                  : undefined
              }
            >
              <option value="">Sélectionnez...</option>
              <option value="free">Entrée libre</option>
              <option value="paid">Entrée payante</option>
              <option value="reservation">Réservation</option>
              <option value="reduction">Réduction sous condition(s)</option>
              <option value="other">Autres</option>
            </select>
            {errors.accessConditionsType && (
              <p
                id="accessConditionsType-error"
                className="text-xs mt-1 error-text"
              >
                {errors.accessConditionsType.message}
              </p>
            )}

            {accessType === "paid" && (
              <div className="mt-3">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Prix en euros"
                      label="Prix (€)"
                      size="base"
                      className="w-full"
                      required
                      aria-required="true"
                      error={errors.price?.message}
                    />
                  )}
                />
              </div>
            )}

            {(accessType === "reservation" ||
              accessType === "reduction" ||
              accessType === "other") && (
              <p className="text-sm text-gray-600 mt-2 mb-4">
                Merci de préciser les détails (horaires, contact, conditions de
                réduction, etc.) dans la description ci-dessous.
              </p>
            )}
          </div>

          {/* Site web */}
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="website"
                placeholder="https://exemple.com"
                label="Site web (optionnel)"
                size="base"
                className="w-full"
                error={errors.website?.message}
              />
            )}
          />

          {/* Description */}
          <div className="mb-2">
            <label
              htmlFor="description"
              className="block text-base font-medium mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    id="description"
                    {...field}
                    placeholder={
                      accessType === "reservation" ||
                      accessType === "reduction" ||
                      accessType === "other"
                        ? "Précisez les détails (horaires, contact, conditions, etc.)"
                        : ""
                    }
                    className="w-full border px-3 py-2 text-base input-surface placeholder-muted placeholder:text-[15px] resize-vertical min-h-[120px]"
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description ? "description-error" : undefined
                    }
                  ></textarea>
                  {errors.description && (
                    <p
                      id="description-error"
                      className="error-text text-xs mt-1"
                    >
                      {errors.description.message}
                    </p>
                  )}
                </div>
              )}
            />
            {descriptionValue.length < 20 && (
              <p className="error-text text-sm mt-1">
                La description doit contenir au moins 20 caractères.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || descriptionValue.length < 20}
            aria-disabled={loading || descriptionValue.length < 20}
            className={`mt-6 ${
              loading || descriptionValue.length < 20
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? "Envoi..." : "Publier le bon plan"}
          </Button>
        </FocusRing>
      </form>
    </div>
  );
}
