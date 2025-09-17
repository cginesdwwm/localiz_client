// PAGE GERER MON COMPTE
import BackLink from "../../components/Common/BackLink";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { notify } from "../../utils/notify";
import Button from "../../components/Common/Button";
import ToggleSwitch from "../../components/Common/ToggleSwitch";
import { BASE_URL } from "../../utils/url";

function BioField({ value = "", onChange }) {
  useEffect(() => {}, [value]);
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder="Dis-nous en plus sur toi !"
        maxLength={120}
        className="w-full min-h-[80px] resize-none p-2 text-sm text-gray-800 dark:text-white bg-transparent outline-none"
        aria-label="Bio utilisateur"
      />

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-muted"></div>
        <div className="text-xs text-muted">
          <span>{(value || "").length}</span>/120
        </div>
      </div>
    </div>
  );
}

function MaPositionRow({ postalCode }) {
  const [town, setTown] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchTown() {
      if (!postalCode) {
        setTown(null);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/utils/postal-to-town/${encodeURIComponent(postalCode)}`
        );
        if (!res.ok) {
          setTown(null);
          return;
        }
        const data = await res.json();
        if (mounted) setTown(data.town || null);
      } catch {
        setTown(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchTown();
    return () => {
      mounted = false;
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

  const [draft, setDraft] = useState({});
  const [savingAll, setSavingAll] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!user) return;
    setDraft({
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
  }, [user]);

  // small helper component for editable fields (controlled, saved on page save)
  function FieldEditor({
    field,
    type = "text",
    value = "",
    placeholder,
    onChange,
  }) {
    return (
      <div>
        {field === "gender" ? (
          <>
            <select
              value={value || ""}
              aria-label="Genre"
              onChange={(e) => onChange && onChange(e.target.value)}
              className="w-full p-1 text-sm bg-transparent outline-none"
            >
              <option value="">Genre</option>
              <option value="female">Femme</option>
              <option value="male">Homme</option>
              <option value="other">Autre / Je préfère ne pas répondre</option>
            </select>
          </>
        ) : (
          <>
            <input
              type={type}
              value={value || ""}
              placeholder={placeholder}
              onChange={(e) => onChange && onChange(e.target.value)}
              className="w-full p-1 text-sm bg-transparent outline-none"
            />
          </>
        )}
      </div>
    );
  }

  async function saveAll() {
    try {
      setSavingAll(true);
      // Build payload with only changed fields to avoid unnecessary uniqueness checks
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
      for (const key of Object.keys(draft || {})) {
        let next = draft[key];
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

      if (Object.keys(payload).length === 0) {
        notify.info("Aucune modification à sauvegarder");
        setSavingAll(false);
        return;
      }

      await updateUser(payload);
      notify.success("Profil sauvegardé");
    } catch (err) {
      const msg = err?.message || "Erreur lors de la sauvegarde";
      if (msg.toLowerCase().includes("email")) {
        setFieldErrors((f) => ({ ...f, email: msg }));
      }
      notify.error(msg);
    } finally {
      setSavingAll(false);
    }
  }

  // compute avatar src, prefix with BASE_URL when the stored value is a relative path
  function avatarSrc() {
    const src = draft?.profilePhoto || user?.profilePhoto || "";
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
        <BackLink fixed to="/profile/me" label="Gérer mon compte" />
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
                draft?.profilePhoto &&
                draft?.profilePhoto !== user?.profilePhoto
                  ? "avatar-unsaved"
                  : undefined
              }
            >
              {draft?.profilePhoto || user?.profilePhoto ? (
                <div className="relative w-full h-full">
                  <img
                    src={avatarSrc()}
                    alt={avatarAlt()}
                    className="w-full h-full object-cover"
                  />
                  {draft?.profilePhoto &&
                    draft?.profilePhoto !== user?.profilePhoto && (
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
              {draft?.profilePhoto && draft?.profilePhoto !== user?.profilePhoto
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
            value={draft?.bio}
            onChange={(v) => setDraft((d) => ({ ...d, bio: v }))}
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
                  <FieldEditor
                    field="lastName"
                    value={draft?.lastName}
                    placeholder="Ton nom"
                    onChange={(v) => setDraft((d) => ({ ...d, lastName: v }))}
                  />
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
                  <FieldEditor
                    field="firstName"
                    value={draft?.firstName}
                    placeholder="Ton prénom"
                    onChange={(v) => setDraft((d) => ({ ...d, firstName: v }))}
                  />
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
                <ToggleSwitch
                  checked={!!draft?.showFirstName}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, showFirstName: !!v }))
                  }
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
                    value={draft?.email}
                    placeholder="Adresse email"
                    onChange={(v) => {
                      setFieldErrors((f) => ({ ...f, email: undefined }));
                      setDraft((d) => ({ ...d, email: v }));
                    }}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="error-text text-xs mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
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
                    value={draft?.phone}
                    placeholder="Numéro de téléphone"
                    onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
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
                  <FieldEditor
                    field="gender"
                    value={draft?.gender}
                    placeholder="Genre"
                    onChange={(v) => setDraft((d) => ({ ...d, gender: v }))}
                  />
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
                  <FieldEditor
                    field="birthday"
                    type="date"
                    value={draft?.birthday}
                    onChange={(v) => setDraft((d) => ({ ...d, birthday: v }))}
                  />
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
                <ToggleSwitch
                  checked={!!draft?.showCity}
                  onChange={(v) => setDraft((d) => ({ ...d, showCity: !!v }))}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 mb-10 flex justify-end">
        <Button
          onClick={saveAll}
          disabled={savingAll}
          aria-disabled={savingAll}
        >
          {savingAll ? "Sauvegarde..." : "Sauvegarder"}
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
