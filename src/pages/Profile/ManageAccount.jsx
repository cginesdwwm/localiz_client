// PAGE GERER MON COMPTE
import BackLink from "../../components/Common/BackLink";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useMemo } from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import ToggleSwitch from "../../components/Common/ToggleSwitch";
import { BASE_URL } from "../../utils/url";

function BioField({ value = "", onChange, disabled }) {
  return (
    <div>
      <label htmlFor="bio" className="sr-only">
        Ma bio
      </label>
      <textarea
        id="bio"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder="Dis-nous en plus sur toi !"
        maxLength={120}
        className="w-full min-h-[80px] resize-none p-2 text-sm text-gray-800 dark:text-white bg-transparent outline-none"
        aria-label="Bio utilisateur"
        aria-describedby="bio-count"
        disabled={disabled}
      />

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-muted"></div>
        <div id="bio-count" className="text-xs text-muted">
          <span>{(value || "").length}</span>/120
        </div>
      </div>
    </div>
  );
}

const postalCache = {};

function MaPositionRow({ postalCode }) {
  const [town, setTown] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchTown() {
      if (!postalCode) {
        setTown(null);
        return;
      }

      if (postalCache[postalCode]) {
        setTown(postalCache[postalCode]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/utils/postal-to-town/${encodeURIComponent(postalCode)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          if (mounted) setTown(null);
          return;
        }
        const data = await res.json();
        const t = data.town || null;
        postalCache[postalCode] = t;
        if (mounted) setTown(t);
      } catch (err) {
        if (err.name === "AbortError") return;
        if (mounted) setTown(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTown();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [postalCode]);

  return (
    <div className="w-full flex items-center justify-between p-3 border-t">
      <div className="w-full grid grid-cols-3 gap-4 items-center">
        <div className="col-span-1">
          <p className="font-ui !font-bold text-[16px]">Ma position</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm">{postalCode || "-"}</p>
          <div>{loading ? "Chargement..." : town || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default function ManageAccount() {
  const { user, updateUser } = useAuth() || {};

  // validation schema
  const schema = useMemo(
    () =>
      yup.object({
        firstName: yup.string().trim().max(50, "Trop long"),
        lastName: yup.string().trim().max(50, "Trop long"),
        email: yup.string().trim().email("Adresse email invalide").required(""),
        phone: yup
          .string()
          .trim()
          .matches(/^[0-9+\s().-]{0,20}$/, "Numéro de téléphone invalide"),
        bio: yup.string().max(120, "Trop long"),
        birthday: yup
          .string()
          .matches(/^$|^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
        gender: yup.string().oneOf(["", "female", "male", "other"]),
        profilePhoto: yup.string(),
        showFirstName: yup.boolean(),
        showCity: yup.boolean(),
      }),
    []
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), defaultValues: {} });

  useEffect(() => {
    if (!user) return;
    reset({
      bio: user?.bio || "",
      lastName: user?.lastName || user?.nom || "",
      firstName: user?.firstName || user?.prenom || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      profilePhoto: user?.profilePhoto || "",
      birthday: user?.birthday
        ? new Date(user.birthday).toISOString().slice(0, 10)
        : "",
      showFirstName: !!user?.showFirstName,
      showCity: !!user?.showCity,
    });
  }, [user, reset]);

  // memoize payload to avoid repeated computation in render
  const memoPayload = useMemo(() => {
    const values = watch();
    const current = {
      bio: user?.bio || "",
      lastName: user?.lastName || user?.nom || "",
      firstName: user?.firstName || user?.prenom || "",
      email: (user?.email || "").trim().toLowerCase(),
      phone: user?.phone || "",
      profilePhoto: user?.profilePhoto || "",
      gender: user?.gender || "",
      birthday: user?.birthday
        ? new Date(user.birthday).toISOString().slice(0, 10)
        : "",
      showFirstName: !!user?.showFirstName,
      showCity: !!user?.showCity,
    };

    const payload = {};
    for (const key of Object.keys(values || {})) {
      let next = values[key];
      if (key === "email") {
        next = (next || "").trim().toLowerCase();
      }
      if (key === "birthday") {
        next = next || "";
      }
      if (String(next) !== String(current[key])) {
        payload[key] = next;
      }
    }

    return payload;
  }, [watch, user]);

  // small helper component for editable fields (controlled, saved on page save)
  function FieldEditor({ field, type = "text", placeholder }) {
    const inputId = `field-${field}`;
    const value = watch(field);
    const err = errors[field]?.message;
    return (
      <div>
        {field === "gender" ? (
          <>
            <label htmlFor={inputId} className="sr-only">
              Genre
            </label>
            <Controller
              control={control}
              name="gender"
              render={({ field: ctl }) => (
                <select
                  id={inputId}
                  {...ctl}
                  className="w-full p-1 text-sm bg-transparent outline-none"
                  disabled={isSubmitting}
                >
                  <option value="">Genre</option>
                  <option value="female">Femme</option>
                  <option value="male">Homme</option>
                  <option value="other">
                    Autre / Je préfère ne pas répondre
                  </option>
                </select>
              )}
            />
          </>
        ) : (
          <>
            <label htmlFor={inputId} className="sr-only">
              {placeholder || field}
            </label>
            <input
              id={inputId}
              type={type}
              value={value || ""}
              placeholder={placeholder}
              onChange={(e) =>
                setValue(field, e.target.value, { shouldDirty: true })
              }
              className="w-full p-1 text-sm bg-transparent outline-none"
              aria-describedby={err ? `${inputId}-error` : undefined}
              disabled={isSubmitting}
            />
            {err && (
              <p id={`${inputId}-error`} className="error-text text-xs mt-1">
                {err}
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  async function onSubmit(values) {
    try {
      const payload = memoPayload;
      if (Object.keys(payload).length === 0) {
        notify.info("Aucune modification à sauvegarder");
        return;
      }

      await updateUser(payload);
      notify.success("Profil sauvegardé");
      // reset form dirty state
      reset({ ...values });
    } catch (err) {
      const msg = err?.message || "Erreur lors de la sauvegarde";
      if (msg.toLowerCase().includes("email")) {
        setError("email", { type: "server", message: msg });
      }
      notify.error(msg);
    }
  }

  // ...compute payload moved into memoized `memoPayload` above...

  // compute avatar src, prefix with BASE_URL when the stored value is a relative path
  function avatarSrc() {
    const src = watch("profilePhoto") || user?.profilePhoto || "";
    if (!src) return "";
    // if src already looks absolute (http/https/data:) return as-is
    if (/^(https?:|data:)/i.test(src)) return src;
    // otherwise prefix with BASE_URL
    return `${BASE_URL.replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
  }

  function avatarAlt() {
    const name =
      user?.firstName || user?.prenom || user?.email || "utilisateur";
    return `Photo de profil de ${name}`;
  }

  return (
    <div className="p-6 relative max-w-3xl mx-auto">
      <div className="mb-6">
        <BackLink to="/profile/me" label="Gérer mon compte" />
      </div>

      {/* Section 1: Modifier mon profil */}
      <section className="mb-10">
        <h3 className="font-ui font-semibold text-[18px] mb-3 ">
          Ma photo de profil
        </h3>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
              aria-label="Changer la photo de profil"
              aria-describedby={
                watch("profilePhoto") &&
                watch("profilePhoto") !== user?.profilePhoto
                  ? "avatar-unsaved"
                  : undefined
              }
            >
              {watch("profilePhoto") || user?.profilePhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={avatarSrc()}
                    alt={avatarAlt()}
                    className="w-full h-full object-cover"
                  />
                  {watch("profilePhoto") &&
                    watch("profilePhoto") !== user?.profilePhoto && (
                      <span className="absolute right-0 top-0 m-1 bg-yellow-400 text-xs text-black px-2 py-0.5 rounded">
                        Non sauvegardé
                      </span>
                    )}
                </div>
              ) : (
                <div className="text-gray-500 font-bold text-2xl">+</div>
              )}
            </button>

            {/* Accessible status for screen readers when an uploaded avatar is not yet saved */}
            <span
              id="avatar-unsaved"
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
            >
              {watch("profilePhoto") &&
              watch("profilePhoto") !== user?.profilePhoto
                ? "Nouvelle image prête, n'oubliez pas de cliquer sur Sauvegarder"
                : ""}
            </span>

            <div>
              <div className="cursor-default font-ui !font-bold text-[16px] text-primary">
                Changer ma photo de profil
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Ma bio */}
      <section className="mb-10">
        <h3 className="font-ui font-bold text-[18px] mb-3">Ma bio</h3>

        <div className="border border-gray-200 rounded-lg p-4 dark:bg-midnight">
          <BioField
            value={watch("bio")}
            onChange={(v) => setValue("bio", v, { shouldDirty: true })}
            disabled={isSubmitting}
          />
        </div>
      </section>

      {/* Section 3: Mes infos */}
      <section>
        <h3 className="font-ui font-bold text-[18px] mb-3">Mes infos</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden dark:bg-midnight">
          <div className="w-full">
            <div className="w-full flex items-center justify-between p-3 border-t first:border-t-0">
              <div className="w-full grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <p className="font-quicksand !font-bold text-[16px]">Nom</p>
                </div>
                <div className="col-span-2">
                  <FieldEditor field="lastName" placeholder="Ton nom" />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-between p-3 border-t">
              <div className="w-full grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <p className="font-quicksand !font-bold text-[16px]">
                    Prénom
                  </p>
                </div>
                <div className="col-span-2">
                  <FieldEditor field="firstName" placeholder="Ton prénom" />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-between p-3 border-t">
              <div>
                <p className="font-quicksand !font-bold text-[16px]">
                  Afficher mon prénom sur mon profil
                </p>
              </div>
              <div>
                <Controller
                  control={control}
                  name="showFirstName"
                  render={({ field: ctl }) => (
                    <ToggleSwitch
                      checked={!!ctl.value}
                      onChange={(v) => ctl.onChange(!!v)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-between p-3 border-t">
              <div className="w-full grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <p className="font-quicksand !font-bold text-[16px]">Email</p>
                </div>
                <div className="col-span-2">
                  <FieldEditor
                    field="email"
                    type="email"
                    placeholder="Adresse email"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-between p-3 border-t">
              <div className="w-full grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <p className="font-quicksand !font-bold text-[16px]">
                    Téléphone
                  </p>
                </div>
                <div className="col-span-2">
                  <FieldEditor
                    field="phone"
                    type="tel"
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-between p-3 border-t">
              <div className="w-full grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <p className="font-quicksand !font-bold text-[16px]">Genre</p>
                </div>
                <div className="col-span-2">
                  <FieldEditor field="gender" placeholder="Genre" />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-between p-3 border-t">
              <div className="w-full grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <p className="font-quicksand !font-bold text-[16px]">
                    Anniversaire
                  </p>
                </div>
                <div className="col-span-2">
                  <FieldEditor field="birthday" type="date" />
                </div>
              </div>
            </div>

            <MaPositionRow postalCode={user?.postalCode} />

            <div className="w-full flex items-center justify-between p-3 border-t">
              <div>
                <p className="font-quicksand !font-bold text-[16px]">
                  Afficher ma ville sur mon profil
                </p>
                <p className="text-sm">
                  Si activé, ta ville s'affichera sur ton profil public.
                </p>
              </div>
              <div>
                <Controller
                  control={control}
                  name="showCity"
                  render={({ field: ctl }) => (
                    <ToggleSwitch
                      checked={!!ctl.value}
                      onChange={(v) => ctl.onChange(!!v)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 mb-10 flex justify-end">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || Object.keys(memoPayload).length === 0}
          aria-disabled={isSubmitting || Object.keys(memoPayload).length === 0}
          className={
            Object.keys(memoPayload).length === 0
              ? "opacity-60 cursor-not-allowed"
              : ""
          }
        >
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {/* Section: Security / Account actions */}
      <section className="mb-6">
        <h3 className="font-ui font-bold text-[18px] mb-3">
          Sécurité du compte
        </h3>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col gap-3">
            <Link
              to="/change-password"
              className="font-quicksand !font-bold text-[16px] text-primary hover:underline"
            >
              Modifier mon mot de passe
            </Link>

            <Link
              to="/delete-account"
              className="font-quicksand !font-bold text-[16px] text-red-600 hover:underline"
            >
              Supprimer mon compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
