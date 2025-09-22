// PAGE GERER MON COMPTE
import BackLink from "../../components/Common/BackLink";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useMemo, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import ToggleSwitch from "../../components/Common/ToggleSwitch";
import { BASE_URL } from "../../utils/url";
import { uploadAvatar } from "../../lib/uploadAvatar";
import { avatarUrl } from "../../lib/avatarUrl";

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
        if (err && err.name === "AbortError") return;
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

function MaPositionEditable({ postalCode: initialPostal }) {
  const { updateUser } = useAuth() || {};
  const [editing, setEditing] = useState(false);
  const [town, setTown] = useState(null);
  const [loadingTown, setLoadingTown] = useState(false);

  // editing states
  const [postalRaw, setPostalRaw] = useState(initialPostal || "");
  const [postalQuery, setPostalQuery] = useState(
    initialPostal ? String(initialPostal).replace(/\D/g, "").slice(0, 5) : ""
  );
  const [towns, setTowns] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTown, setSelectedTown] = useState("");
  const suggestionsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchTown() {
      const postalCode = String(postalQuery || "").replace(/\D/g, "");
      if (!postalCode) {
        setTown(null);
        return;
      }

      if (postalCache[postalCode]) {
        setTown(postalCache[postalCode]);
        return;
      }

      try {
        setLoadingTown(true);
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
        if (mounted) setLoadingTown(false);
      }
    }

    fetchTown();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [postalQuery]);

  // fetch suggestions (geo API) when editing
  useEffect(() => {
    if (!editing) return;
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
  }, [postalQuery, editing]);

  // click outside suggestion list
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

  async function onConfirm() {
    const cleaned = String(postalRaw || "")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (cleaned.length !== 5) {
      notify.error("Veuillez saisir un code postal valide (5 chiffres).");
      return;
    }

    try {
      // prepare payload: include city when possible (selectedTown or lookup)
      const payload = { postalCode: cleaned };
      if (selectedTown) {
        payload.city = selectedTown;
      } else {
        // try to resolve town name from postal code using server endpoint
        try {
          const res = await fetch(
            `${BASE_URL}/utils/postal-to-town/${encodeURIComponent(cleaned)}`
          );
          if (res.ok) {
            const data = await res.json();
            const t = data.town || null;
            if (t) {
              payload.city = t;
              postalCache[cleaned] = t;
            }
          }
        } catch (e) {
          void e;
        }
      }

      await updateUser(payload);
      notify.success("Position mise à jour");
      setEditing(false);
      setPostalQuery(cleaned);
      setPostalRaw(cleaned);
      // update displayed town if known
      setSelectedTown(payload.city || "");
      setTown(payload.city || postalCache[cleaned] || null);
    } catch (err) {
      const msg = err?.message || "Erreur lors de la mise à jour";
      notify.error(msg);
    }
  }

  return (
    <div className="w-full flex items-center justify-between p-3 border-t">
      <div className="w-full grid grid-cols-3 gap-4 items-center">
        <div className="col-span-1">
          <p className="font-ui !font-bold text-[16px]">Ma position</p>
        </div>
        <div className="col-span-2">
          {!editing ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{initialPostal || "-"}</p>
                <div>{loadingTown ? "Chargement..." : town || "-"}</div>
              </div>
              <div>
                <Button onClick={() => setEditing(true)}>Modifier</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    id="edit-postal"
                    value={
                      selectedTown ? `${postalRaw} ${selectedTown}` : postalRaw
                    }
                    onChange={(e) => {
                      const rawInput = String(e.target.value);
                      if (selectedTown) {
                        setSelectedTown("");
                      }
                      setPostalRaw(rawInput);
                      const next = rawInput.replace(/\D/g, "").slice(0, 5);
                      setPostalQuery(next);
                    }}
                    type="text"
                    placeholder="Code postal"
                    aria-label="Code postal"
                    className="h-12"
                    onBlur={() => {}}
                  />

                  <div className="relative" ref={suggestionsRef}>
                    {showSuggestions && towns && towns.length > 0 && (
                      <ul className="absolute z-20 left-0 right-0 mt-2 bg-white text-black rounded border max-h-56 overflow-auto">
                        {towns.map((t) => (
                          <li
                            key={t.code}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setPostalRaw(postalQuery);
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
                </div>

                <div className="mt-1">
                  <Button onClick={onConfirm}>Confirmer</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, children, desc }) {
  return (
    <div className="w-full flex items-center justify-between p-3 border-t">
      <div className="w-full grid grid-cols-3 gap-4 items-center">
        <div className="col-span-1">
          <p className="font-quicksand !font-bold text-[16px]">{label}</p>
        </div>
        <div className="col-span-2">
          {children}
          {desc && <p className="text-sm mt-1">{desc}</p>}
        </div>
      </div>
    </div>
  );
}

// Move FieldEditor to module scope to avoid remounting on each render of ManageAccount
function FieldEditor({
  field,
  type = "text",
  placeholder,
  control,
  watch,
  setValue,
  errors,
  isSubmitting,
}) {
  const inputId = `field-${field}`;
  const value = watch(field);
  const err = errors && errors[field] && errors[field].message;
  useEffect(() => {}, [field]);
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
            onChange={(e) => {
              let next = e.target.value;
              if (field === "phone") {
                // keep digits only and limit to 10 chars
                next = String(next).replace(/\D/g, "").slice(0, 10);
              }
              setValue(field, next, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            className="w-full p-1 text-sm bg-transparent outline-none"
            aria-describedby={err ? `${inputId}-error` : undefined}
            disabled={isSubmitting}
            maxLength={field === "phone" ? 10 : undefined}
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

export default function ManageAccount() {
  const { user, updateUser } = useAuth() || {};
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const previewUrlRef = useRef(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);

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
          .matches(/^\d{0,10}$/, "Numéro de téléphone invalide"),
        bio: yup.string().max(120, "Trop long"),
        birthday: yup
          .string()
          .matches(/^$|^\d{4}-\d{2}-\d{2}$/, "Date invalide")
          .test("min-age", "Vous devez avoir au moins 16 ans.", (value) => {
            if (!value) return true;
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return false;
            const cutoff = new Date();
            cutoff.setFullYear(cutoff.getFullYear() - 16);
            return d <= cutoff;
          }),
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
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
    mode: "onChange",
  });

  // compute a snapshot and list of missing profile fields so we can
  // show a dismissible banner. We compute here so we can react to
  // changes and reset dismissal when the missing list updates.
  const _snapshot =
    typeof control?.getValues === "function" ? control.getValues() : watch();
  const _fieldsToCheck = [
    ["profilePhoto", "Photo de profil"],
    ["bio", "Bio"],
    ["lastName", "Nom"],
    ["firstName", "Prénom"],
    ["email", "Email"],
    ["phone", "Téléphone"],
    ["gender", "Genre"],
    ["birthday", "Anniversaire"],
  ];
  const missing = _fieldsToCheck
    .filter(([key]) => !String(_snapshot?.[key] || "").trim())
    .map(([, label]) => label);

  const missingSig = missing.join("|") || "";

  useEffect(() => {
    // initialize dismissal from localStorage if signature matches
    try {
      const stored = sessionStorage.getItem("profile_banner_dismissed_sig");
      if (stored && stored === missingSig) {
        setBannerDismissed(true);
      } else {
        setBannerDismissed(false);
      }
    } catch (e) {
      void e;
      setBannerDismissed(false);
    }
  }, [missingSig]);

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
    // if user already has profilePhoto and no preview, show it (resolve absolute URL)
    try {
      if (user?.profilePhoto && !avatarPreview && !pendingAvatarFile) {
        setAvatarPreview(avatarUrl(user.profilePhoto || ""));
      }
    } catch (e) {
      void e;
    }
  }, [user, reset, avatarPreview, pendingAvatarFile]);

  // revoke preview URL on unmount
  useEffect(() => {
    return () => {
      try {
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
      } catch (e) {
        void e;
      }
    };
  }, []);

  // memoize payload to avoid repeated computation in render
  // ensure we re-run when form values change by watching the form
  const watchedValues = watch();
  const memoPayload = useMemo(() => {
    const values =
      typeof control?.getValues === "function"
        ? control.getValues()
        : watchedValues;
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
  }, [watchedValues, user, control]);

  async function onSubmit(values) {
    try {
      const payload = memoPayload;

      // if there's a pending avatar file, upload it first and include profilePhoto
      let uploadRes = null;
      if (pendingAvatarFile) {
        try {
          setAvatarUploading(true);
          uploadRes = await uploadAvatar(pendingAvatarFile);
          payload.profilePhoto =
            uploadRes?.path || uploadRes?.publicURL || null;
        } catch (err) {
          console.error("Avatar upload failed:", err);
          notify.error("Impossible d'uploader la photo de profil.");
          setAvatarUploading(false);
          return;
        } finally {
          setAvatarUploading(false);
        }
      }
      if (Object.keys(payload).length === 0) {
        notify.info("Aucune modification à sauvegarder");
        return;
      }
      const updated = await updateUser(payload);
      notify.success("Profil sauvegardé");
      // reset form dirty state and update stored profilePhoto in the form
      try {
        reset({ ...values, profilePhoto: updated?.profilePhoto || "" });
      } catch (e) {
        void e;
      }

      // if we uploaded an avatar, ensure preview persists using returned saved value
      try {
        if (updated?.profilePhoto) {
          const src = updated.profilePhoto;
          // prefer the uploader's publicURL if available (works even when VITE_SUPABASE_URL isn't set)
          const absolute = (uploadRes && uploadRes.publicURL) || avatarUrl(src);
          // revoke local object URL if present
          try {
            if (previewUrlRef.current) {
              URL.revokeObjectURL(previewUrlRef.current);
              previewUrlRef.current = null;
            }
          } catch (e) {
            void e;
          }
          setAvatarPreview(absolute);
          // reflect saved path in form value
          try {
            setValue("profilePhoto", updated.profilePhoto || "", {
              shouldDirty: false,
            });
          } catch (e) {
            void e;
          }
          setPendingAvatarFile(null);
        }
      } catch (e) {
        void e;
      }
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
    return avatarUrl(src);
  }

  function avatarAlt() {
    const name =
      user?.firstName || user?.prenom || user?.email || "utilisateur";
    return `Photo de profil de ${name}`;
  }

  return (
    <div className="p-6 relative max-w-3xl mx-auto">
      <div className="mb-6">
        <BackLink to="/profile/me" fixed />
      </div>

      <div className="p-12">
        <h1
          className="text-3xl heading text-center mt-[-2rem] mb-4 font-bold"
          style={{
            fontFamily: "Fredoka",
            color: "#F4EBD6",
          }}
        >
          Gérer mon compte
        </h1>

        {/* Prompt user to complete profile if some important fields are empty */}
        {!bannerDismissed && missing && missing.length > 0 && (
          <div
            className="mb-6 p-4 bg-primary/10 border-l-4 border-primary rounded relative"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{ border: "1px solid white" }}
          >
            <button
              aria-label="Fermer"
              className="absolute right-2 top-2 text-sm text-muted font-bold hover:text-red-500"
              onClick={() => {
                try {
                  sessionStorage.setItem(
                    "profile_banner_dismissed_sig",
                    missingSig
                  );
                } catch (e) {
                  void e;
                }
                setBannerDismissed(true);
              }}
            >
              ✕
            </button>

            <div>
              <p className="font-quicksand !font-bold mb-1 text-primary">
                Ton profil semble incomplet !
              </p>
              <p className="text-sm text-muted">
                Complète les champs suivants pour améliorer ton profil :
              </p>
              <ul className="mt-2 text-sm list-disc list-inside">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>

              <div className="mt-3">
                <Button
                  onClick={() => {
                    // find first missing key and scroll to it
                    const firstKey = _fieldsToCheck
                      .map((f) => f[0])
                      .find((k) => !String(_snapshot?.[k] || "").trim());
                    if (!firstKey) return;
                    // map to element selectors
                    let el = null;
                    if (firstKey === "profilePhoto") {
                      el = document.querySelector(
                        '[aria-label="Changer la photo de profil"]'
                      );
                    } else if (firstKey === "bio") {
                      el = document.getElementById("bio");
                    } else {
                      el = document.getElementById(`field-${firstKey}`);
                    }
                    if (el && typeof el.scrollIntoView === "function") {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      try {
                        el.focus();
                      } catch (e) {
                        void e;
                      }
                    }
                  }}
                >
                  Remplir maintenant
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Modifier mon profil */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold font-ui mb-3">
            Ma photo de profil
          </h2>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                aria-label="Changer la photo de profil"
                aria-describedby={
                  watch("profilePhoto") &&
                  watch("profilePhoto") !== user?.profilePhoto
                    ? "avatar-unsaved"
                    : undefined
                }
                onClick={() => {
                  try {
                    avatarInputRef.current && avatarInputRef.current.click();
                  } catch (e) {
                    void e;
                  }
                }}
              >
                {avatarPreview || avatarSrc() ? (
                  <div className="relative w-full h-full">
                    <img
                      src={avatarPreview || avatarSrc()}
                      alt={avatarAlt()}
                      className="w-full h-full object-cover"
                    />
                    {(pendingAvatarFile ||
                      (watch("profilePhoto") &&
                        watch("profilePhoto") !== user?.profilePhoto)) && (
                      <span className="absolute right-0 top-0 m-1 bg-yellow-400 text-xs text-black px-2 py-0.5 rounded">
                        Non sauvegardé
                      </span>
                    )}
                    {avatarUploading && (
                      <span className="absolute left-0 bottom-0 m-1 bg-primary text-xs text-white px-2 py-0.5 rounded">
                        Upload...
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 font-bold text-2xl">+</div>
                )}
              </button>

              <input
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

                  // show local preview immediately (create object URL)
                  try {
                    if (previewUrlRef.current) {
                      URL.revokeObjectURL(previewUrlRef.current);
                      previewUrlRef.current = null;
                    }
                    const url = URL.createObjectURL(f);
                    previewUrlRef.current = url;
                    setAvatarPreview(url);
                    // keep file until user saves
                    setPendingAvatarFile(f);
                    // clear any saved profilePhoto value in form until upload
                    setValue("profilePhoto", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  } catch (err) {
                    console.error(err);
                  } finally {
                    try {
                      e.target.value = null;
                    } catch (e) {
                      void e;
                    }
                  }
                }}
              />

              {/* Accessible status for screen readers when an uploaded avatar is not yet saved */}
              <span
                id="avatar-unsaved"
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
              >
                {pendingAvatarFile ||
                (watch("profilePhoto") &&
                  watch("profilePhoto") !== user?.profilePhoto)
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
          <h2 className="text-2xl font-semibold font-ui mb-3">Ma bio</h2>

          <div className="border border-gray-200 rounded-lg p-4 dark:bg-midnight">
            <BioField
              value={watch("bio")}
              onChange={(v) =>
                setValue("bio", v, { shouldDirty: true, shouldValidate: true })
              }
              disabled={isSubmitting}
            />
          </div>
        </section>

        {/* Section 3: Mes infos */}
        <section>
          <h2 className="text-2xl font-semibold font-ui mb-3">Mes infos</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="w-full">
              <InfoRow label="Nom">
                <FieldEditor
                  field="lastName"
                  placeholder="Ton nom"
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </InfoRow>

              <InfoRow label="Prénom">
                <FieldEditor
                  field="firstName"
                  placeholder="Ton prénom"
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </InfoRow>

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

              <InfoRow label="Email">
                <FieldEditor
                  field="email"
                  type="email"
                  placeholder="Adresse email"
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </InfoRow>

              <InfoRow label="Téléphone">
                <FieldEditor
                  field="phone"
                  type="tel"
                  placeholder="Numéro de téléphone"
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </InfoRow>

              <InfoRow label="Genre">
                <FieldEditor
                  field="gender"
                  placeholder="Genre"
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </InfoRow>

              <InfoRow label="Anniversaire">
                <FieldEditor
                  field="birthday"
                  type="date"
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </InfoRow>

              <MaPositionEditable postalCode={user?.postalCode} />

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
            disabled={
              isSubmitting ||
              !isValid ||
              (Object.keys(memoPayload).length === 0 && !pendingAvatarFile)
            }
            aria-disabled={
              isSubmitting ||
              !isValid ||
              (Object.keys(memoPayload).length === 0 && !pendingAvatarFile)
            }
            className={
              (Object.keys(memoPayload).length === 0 && !pendingAvatarFile) ||
              !isValid
                ? "opacity-60 cursor-not-allowed"
                : ""
            }
          >
            {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>

        {/* Section: Security / Account actions */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold font-ui mb-3">
            Sécurité du compte
          </h2>

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
    </div>
  );
}
