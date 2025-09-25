/**
 * Formulaire de publication d’une annonce (AddListingForm)
 *
 * Rôle: Création d’une annonce de don/troc avec images, titre, catégorie,
 * état, localisation (code postal + ville avec suggestions) et description.
 * Valide via yup et mappe les erreurs serveur aux champs pertinents.
 *
 * Accessibilité:
 * - Labels explicites, messages d’erreur role="alert".
 * - Combobox/listbox pour la ville avec gestion ARIA du focus et des options.
 * - Zone de drop d’images accessible clavier (Enter/Espace).
 */
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadListingImage } from "../../lib/uploadListingImage";
import { createListing } from "../../api/listings.api";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import FocusRing from "../../components/Common/FocusRing";
import BackLink from "../../components/Common/BackLink";
import { LISTING_TAGS } from "../../constants/listingTags";
import { getPublicCategories } from "../../api/utils.api";

const baseSchema = (allowedTags) =>
  yup.object({
    image: yup.mixed().required("Image requise"),
    title: yup.string().required("Titre requis"),
    tag: yup
      .string()
      .oneOf(allowedTags, "Catégorie invalide")
      .required("Catégorie requise"),
    condition: yup
      .string()
      .oneOf(["new", "like_new", "used"], "État invalide")
      .required("État requis"),
    postalCode: yup
      .string()
      .required("Code postal requis")
      .matches(/^\d{5}$/i, "Code postal invalide"),
    city: yup.string().required("Ville requise"),
    type: yup
      .string()
      .oneOf(["swap", "donate"], "Type invalide")
      .required("Type de transaction requis"),
    description: yup
      .string()
      .required("Description requise")
      .min(20, "La description doit contenir au moins 20 caractères"),
  });

export default function AddListingForm() {
  const [loading, setLoading] = useState(false);
  const [allowedTags, setAllowedTags] = useState(LISTING_TAGS);
  const [images, setImages] = useState([]); // [{file, url}]
  const [dragActive, setDragActive] = useState(false);
  const [towns, setTowns] = useState([]);
  const [postalQuery, setPostalQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [postalRaw, setPostalRaw] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [activeTownIndex, setActiveTownIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const postalListboxId = "listing-postal-suggestions";

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(baseSchema(allowedTags)) });
  const descriptionValue = watch("description") || "";

  // Load categories from API, fallback to constants
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getPublicCategories();
        const items = Array.isArray(res?.listing) ? res.listing : [];
        if (!cancelled && items.length) {
          setAllowedTags(items);
        }
      } catch {
        // keep fallback LISTING_TAGS
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const fileInputs = Array.isArray(images) ? images : [];
      if (fileInputs.length === 0) throw new Error("Image requise");
      const uploads = fileInputs.map((it) => uploadListingImage(it.file));
      const results = await Promise.all(uploads);
      const urls = results
        .map((r) => r?.publicURL || r?.path || null)
        .filter(Boolean);

      const location = { postalCode: values.postalCode };
      if (values.city) location.city = values.city;
      const payload = {
        title: values.title,
        images: urls,
        tags: values.tag ? [values.tag] : [],
        condition: values.condition,
        location,
        type: values.type,
        description: values.description,
      };

      const created = await createListing(payload);
      const id = created?._id || created?.id;
      if (id) {
        navigate(`/listings/${encodeURIComponent(id)}`);
      } else {
        navigate("/listings");
      }
    } catch (err) {
      console.error(err);
      if (err && err.payload && Array.isArray(err.payload.errors)) {
        err.payload.errors.forEach((e) => {
          const nameRaw =
            (typeof e.param === "string" && e.param) ||
            (typeof e.path === "string" && e.path) ||
            "";
          const last = nameRaw.includes(".")
            ? nameRaw.split(".").pop()
            : nameRaw;
          let target = last === "images" ? "image" : last;
          if (nameRaw.startsWith("location.")) {
            if (last === "postalCode") target = "postalCode";
            if (last === "city") target = "city";
          }
          if (nameRaw === "tags" || nameRaw.startsWith("tags.")) {
            target = "tag";
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

  // Fetch town suggestions for postal code (same as Deals)
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
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="p-4">
      <BackLink to="/publish" fixed />
      <div className="mb-4 text-center">
        <h1
          className="text-3xl font-bold text-center text-[var(--text)] mb-8"
          style={{ fontFamily: "Fredoka" }}
        >
          Publier une annonce
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mb-6 mx-auto max-w-[400px]"
      >
        <FocusRing>
          {/* Titre */}
          <div className="mb-6">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Titre de l'annonce"
                  label="Titre"
                  size="base"
                  required
                  className="w-full"
                  error={errors.title?.message}
                />
              )}
            />
          </div>

          {/* Type: Don ou Troc */}
          <div className="mb-6">
            <label htmlFor="type" className="block text-base font-medium mb-1">
              Type *
            </label>
            <select
              id="type"
              {...register("type")}
              className="w-full border px-3 py-2 input-surface h-12 text-base"
              required
              aria-invalid={!!errors.type}
              aria-describedby={errors.type ? "type-error" : undefined}
            >
              <option value="">Sélectionnez...</option>
              <option value="donate">Don</option>
              <option value="swap">Troc</option>
            </select>
            {errors.type && (
              <p id="type-error" className="text-xs mt-1 error-text">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Catégorie */}
          <div className="mb-6">
            <label htmlFor="tag" className="block text-base font-medium mb-2">
              Catégorie *
            </label>
            <select
              id="tag"
              {...register("tag")}
              className="w-full border px-3 py-2 input-surface h-12 text-base"
              aria-invalid={!!errors.tag}
              aria-describedby={errors.tag ? "tag-error" : undefined}
            >
              <option value="">Sélectionnez...</option>
              {allowedTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.tag && (
              <p id="tag-error" className="text-xs mt-1 error-text">
                {errors.tag.message}
              </p>
            )}
          </div>

          {/* État de l'objet */}
          <div className="mb-6">
            <label
              htmlFor="condition"
              className="block text-base font-medium mb-2"
            >
              État *
            </label>
            <select
              id="condition"
              {...register("condition")}
              className="w-full border px-3 py-2 input-surface h-12 text-base"
              required
              aria-invalid={!!errors.condition}
              aria-describedby={
                errors.condition ? "condition-error" : undefined
              }
            >
              <option value="">Sélectionnez...</option>
              <option value="new">Neuf</option>
              <option value="like_new">Comme neuf</option>
              <option value="used">D'occasion</option>
            </select>
            {errors.condition && (
              <p id="condition-error" className="text-xs mt-1 error-text">
                {errors.condition.message}
              </p>
            )}
          </div>

          {/* Images (max 4) drag & drop */}
          <div className="mb-6">
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
                role="button"
                tabIndex={0}
                aria-label="Ajouter des images pour l'annonce"
                aria-describedby="listing-images-help"
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
                  document.getElementById("listing-image-input")?.click()
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    document.getElementById("listing-image-input")?.click();
                  }
                }}
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
                role="button"
                tabIndex={0}
                aria-label="Ajouter ou réorganiser des images"
                aria-describedby="listing-images-help"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    document.getElementById("listing-image-input")?.click();
                  }
                }}
              >
                <div className="flex flex-wrap gap-3">
                  {images.map((it, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={it.url}
                        alt={`Prévisualisation image ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        aria-label="Retirer"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center"
                        onClick={() => {
                          const next = images.filter((_, i) => i !== idx);
                          try {
                            URL.revokeObjectURL(images[idx].url);
                          } catch {
                            // ignore revoke failures
                          }
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
                      variant="cta"
                      className="px-4 py-2"
                      onClick={() =>
                        document.getElementById("listing-image-input")?.click()
                      }
                    >
                      Ajouter d'autres images
                    </Button>
                  </div>
                )}
              </div>
            )}
            <p id="listing-images-help" className="sr-only">
              Vous pouvez glisser-déposer jusqu'à 4 images. Appuyez sur Entrée
              ou Espace pour ouvrir le sélecteur de fichiers.
            </p>
            {/* Hidden input to add/select files */}
            <input
              id="listing-image-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
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
                e.target.value = "";
              }}
            />
            {errors.image && (
              <p
                id="image-error"
                role="alert"
                className="text-xs mt-1 error-text"
              >
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Code postal + Ville (suggestions) */}
          <div className="flex flex-col mb-6">
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
                      setShowSuggestions(true);
                      setActiveTownIndex(-1);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    type="text"
                    placeholder="Code postal"
                    aria-label="Code postal"
                    label="Code postal"
                    size="base"
                    required
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions && towns.length > 0}
                    aria-controls={postalListboxId}
                    aria-activedescendant={
                      activeTownIndex >= 0 && towns[activeTownIndex]
                        ? `listing-postal-option-${towns[activeTownIndex].code}`
                        : undefined
                    }
                    error={errors.postalCode?.message}
                    className="h-12"
                    onKeyDown={(e) => {
                      if (!showSuggestions || towns.length === 0) return;
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveTownIndex((i) =>
                          i < towns.length - 1 ? i + 1 : 0
                        );
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActiveTownIndex((i) =>
                          i > 0 ? i - 1 : towns.length - 1
                        );
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        const idx = activeTownIndex >= 0 ? activeTownIndex : 0;
                        const t = towns[idx];
                        if (t) {
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
                        }
                      } else if (e.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                  />
                );
              }}
            />

            {/* Suggestions dropdown for towns */}
            <div className="relative" ref={suggestionsRef}>
              {showSuggestions && towns && towns.length > 0 && (
                <ul
                  id={postalListboxId}
                  role="listbox"
                  className="absolute z-20 left-0 right-0 mt-2 bg-white text-black border rounded max-h-56 overflow-auto"
                  aria-label="Villes correspondantes au code postal"
                >
                  {towns.map((t) => (
                    <li
                      key={t.code}
                      id={`listing-postal-option-${t.code}`}
                      role="option"
                      aria-selected={
                        activeTownIndex >= 0 &&
                        towns[activeTownIndex] &&
                        towns[activeTownIndex].code === t.code
                      }
                      className={`px-3 py-2 cursor-pointer ${
                        activeTownIndex >= 0 &&
                        towns[activeTownIndex] &&
                        towns[activeTownIndex].code === t.code
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                      onMouseEnter={() => {
                        const idx = towns.findIndex((tw) => tw.code === t.code);
                        setActiveTownIndex(idx);
                      }}
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

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-base font-medium mb-1"
            >
              Description *
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    id="description"
                    {...field}
                    className="w-full border px-3 py-2 text-base input-surface placeholder-muted placeholder:text-[15px] resize-vertical min-h-[120px]"
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description ? "description-error" : undefined
                    }
                  ></textarea>
                  {errors.description && (
                    <p
                      id="description-error"
                      role="alert"
                      className="error-text text-xs mt-1"
                    >
                      {errors.description.message}
                    </p>
                  )}
                </div>
              )}
            />
            {descriptionValue.length < 20 && (
              <p className="error-text text-sm mt-1" aria-live="polite">
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
            {loading ? "Envoi..." : "Publier l'annonce"}
          </Button>
        </FocusRing>
      </form>
    </div>
  );
}
