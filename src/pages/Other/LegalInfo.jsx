// PAGE INFORMATIONS LEGALES

import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import BackLink from "../../components/Common/BackLink";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusHeading from "../../hooks/useFocusHeading";

export default function LegalInfo() {
  const { hash, pathname } = useLocation();
  const headingRef = useRef(null);
  useDocumentTitle("Informations légales");
  useFocusHeading(headingRef);

  useEffect(() => {
    if (!hash) return;
    // small timeout to ensure the DOM is rendered
    const id = hash.replace("#", "");
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return (
    <main className="p-10 mx-auto" role="main">
      <BackLink to="/settings" fixed />

      <div className="p-12">
        <h1
          className="text-3xl font-quicksand !font-bold mb-4"
          style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
          ref={headingRef}
        >
          Informations légales
        </h1>

        <section className="mt-4 text-left" tabIndex={-1} id="mentions-section">
          {/* === Mentions légales === */}
          <h2
            id="mentions"
            className="text-2xl font-semibold font-quicksand uppercase mb-3 underline"
          >
            Mentions légales
          </h2>
          <div className="space-y-2">
            {/* -- Éditeur de l'application -- */}
            <p className="m-0 !font-bold">Éditeur de l'application</p>
            <p className="m-0">Localiz est éditée par :</p>
            <p className="m-0">Nom de l'entreprise / association : Localiz</p>
            <p className="m-0">Statut juridique : Association loi 1901</p>
            <address className="m-0 not-italic">
              Siège social : 6 Rue Sadi Carnot, 62400 Béthune
            </address>
            <p className="m-0">
              Téléphone :{" "}
              <a
                href="tel:0612345678"
                className="underline"
                aria-label="Appeler Localiz au plus zéro six douze trente quatre cinquante six soixante dix huit"
              >
                06 12 34 56 78
              </a>
            </p>
            <address className="m-0 not-italic">
              Email de contact :{" "}
              <a
                href="mailto:contact@localiz.fr"
                className="underline"
                aria-label="Envoyer un email à contact arobase localiz point fr"
              >
                contact@localiz.fr
              </a>
            </address>
            <p className="m-0">
              Directrice de la publication : Mme Chloé GINES
            </p>

            {/* -- Hébergement -- */}
            <p className="mt-6 m-0 !font-bold">Hébergement</p>
            <p className="m-0">L'application est hébergée par :</p>
            <p className="m-0">Nom de l'hébergeur : Netlify</p>
            <address className="m-0 not-italic">
              Adresse de l'hébergeur : 44 Montgomery Street, Suite 300, San
              Francisco, CA 94104, États-Unis
            </address>
            <p className="m-0">
              Téléphone :{" "}
              <a
                href="tel:+18448997312"
                className="underline"
                aria-label="Appeler le service d'hébergement au plus un huit quatre quatre huit neuf neuf sept trois un deux"
              >
                +1 844-899-7312
              </a>
            </p>
            <address className="m-0 not-italic">
              Email de contact:{" "}
              <a
                href="mailto:support@netlify.com"
                className="underline"
                aria-label="Envoyer un email au support Netlify"
              >
                support@netlify.com
              </a>
            </address>
          </div>
        </section>

        <section id="cgu" className="mt-12 text-left" tabIndex={-1}>
          {/* === Conditions générales d'utilisation (CGU) === */}
          <h2 className="text-2xl font-semibold font-quicksand uppercase mb-3 underline">
            Conditions générales d'utilisation (CGU)
          </h2>
          <div>
            {/* -- Objet -- */}
            <div>
              <p className="!font-bold m-0">Objet</p>
              <p className="m-0">
                Les présentes conditions ont pour but de définir les modalités
                d'utilisation de l'application Localiz.
              </p>
            </div>

            <div>
              {/* -- Services proposés -- */}
              <p className="!font-bold mt-6">Services proposés</p>
              <p className="m-0">
                Localiz te permet de te connecter avec d'autres personnes autour
                :
              </p>
              <ul className="list-disc ml-5 mt-1">
                <li>du partage de bons plans locaux,</li>
                <li>du don et troc d'objets du quotidien,</li>
                <li>du recyclage et de l'upcycling.</li>
              </ul>
            </div>

            <div>
              {/* -- Inscription -- */}
              <p className="!font-bold mt-6">Inscription</p>
              <p className="m-0">
                L'accès aux fonctionnalités de publication nécessite la création
                d'un compte utilisateur. Les utilisateurs doivent fournir des
                informations exactes et tenir à jour leur profil.
              </p>
            </div>

            <div>
              {/* -- Âge minimum requis -- */}
              <p className="!font-bold mt-6">Âge minimum requis</p>
              <p className="m-0">
                Pour t'inscrire sur Localiz, tu dois avoir{" "}
                <b>au moins 16 ans</b>. L'application n'est pas accessible aux
                mineurs de moins de 16 ans, même avec l'autorisation de leurs
                parents ou tuteurs. Ce choix permet de garantir un environnement
                plus sûr pour l'ensemble des utilisateurs, notamment en cas de
                rencontres physiques.
              </p>
            </div>

            <div>
              {/* -- Suppression de compte -- */}
              <p className="!font-bold mt-6">Suppression de compte</p>
              <p className="m-0">
                L'utilisateur peut supprimer son compte à tout moment via les
                paramètres de l'application.
              </p>
            </div>

            <div>
              {/* -- Responsabilité de l'utilisateur -- */}
              <p className="!font-bold mt-6">Responsabilité de l'utilisateur</p>
              <p className="m-0">
                Les utilisateurs s'engagent à ne pas publier de contenus
                illicites, haineux, violents ou portant atteinte aux droits
                d'autrui.
              </p>
            </div>

            <div>
              {/* -- Sécurité lors des échanges physiques -- */}
              <p className="!font-bold mt-6">
                Sécurité lors des échanges physiques
              </p>
              <p className="m-0">
                Même si Localiz ne collecte pas de données sensibles sur les
                rencontres entre membres, nous rappelons que les échanges
                d'objets ou les rencontres initiés via l'application peuvent
                impliquer une interaction en présentiel.
              </p>{" "}
              <br />
              <p className="m-0">
                Pour prévenir tout risque ou situation inconfortable, Localiz
                recommande fortement que les échanges se fassent :
              </p>
              <ul className="list-disc ml-5 mt-1">
                <li>dans des lieux publics et fréquentés,</li>
                <li>en journée,</li>
                <li>
                  avec la présence d'une personne de confiance accompagnant
                  chaque utilisateur lorsque cela est possible.
                </li>
              </ul>
              <br />
              <p className="m-0">
                Localiz ne pourra être tenu responsable en cas d'incident lors
                d'une rencontre physique. Aussi, ces recommandations
                s'appliquent indépendamment de l'âge des utilisateurs.
              </p>
            </div>
          </div>
        </section>

        <section id="privacy" className="mt-12 text-left" tabIndex={-1}>
          {/* === Politique de confidentialité === */}
          <h2 className="text-2xl font-semibold font-quicksand uppercase mb-3 underline">
            Politique de confidentialité
          </h2>
          <div>
            <p className="m-0">
              Chez <strong>Localiz</strong>, nous nous engageons à protéger les
              données personnelles de nos utilisateurs et à les utiliser de
              manière transparente, éthique et conforme au Règlement Général sur
              la Protection des Données (RGPD).
            </p>
            <p className="!font-bold mt-6 m-0 underline">Données collectées</p>
            <p className="m-0">
              Quand tu utilises l'application, voici les données que nous
              pouvons collecter :
            </p>
            <ul className="list-disc ml-5 mt-1">
              <li>
                <b>Données de profil :</b> prénom, nom, genre, pseudo, adresse
                email, mot de passe (chiffré), ville/localisation.
              </li>
              <li>
                <b>Contenu généré par l'utilisateur :</b> annonces, messages,
                photos, commentaires.
              </li>
              <li>
                <b>Historique de navigation :</b> pages consultées, filtres
                utilisés, préférences.
              </li>
              <li>
                <b>Données de géolocalisation :</b> si tu actives cette option,
                pour personnaliser les annonces autour de toi.
              </li>
            </ul>
            {/* -- Finalités d'utilisation -- */}
            <p className="!font-bold mt-6 m-0 underline">
              Finalités d'utilisation
            </p>
            <p className="m-0">Tes données sont utilisées pour :</p>
            <ul className="list-disc ml-5 mt-1">
              <li>créer ton compte et gérer tes publications,</li>
              <li>
                proposer des contenus et objets pertinents selon ta
                localisation,
              </li>
              <li>faciliter les échanges entre utilisateurs,</li>
              <li>prévenir les comportements frauduleux ou illicites,</li>
              <li>améliorer le fonctionnement de l'application.</li>
            </ul>
            {/* -- Base légale du traitement -- */}
            <p className="!font-bold mt-6 m-0 underline">
              Base légale du traitement
            </p>
            <p className="m-0">Le traitement de tes données est basé sur :</p>
            <ul className="list-disc ml-5 mt-1">
              <li>
                <b>ton consentement</b> (article 6.1.a du RGPD) pour les données
                facultatives,
              </li>
              <li>
                et <b>notre intérêt légitime</b> à garantir un service sécurisé
                et fiable (article 6.1.f du RGPD).
              </li>
            </ul>
            {/* -- Base légale du traitement -- */}
            <p className="!font-bold mt-6 m-0 underline">
              Pourquoi demandons-nous le nom et prénom ?
            </p>
            <p className="m-0">
              Lors de ton inscription, Localiz te demande ton nom et ton prénom
              pour plusieurs raisons légitimes :
            </p>
            <ul className="list-disc ml-5 mt-1">
              <li>
                <b>Créer un climat de confiance</b> entre utilisateurs, en
                favorisant les échanges dans un cadre respectueux et
                authentique.
              </li>
              <li>
                <b>Prévenir les abus et comportements frauduleux</b> (ex :
                création de faux comptes, harcèlement).
              </li>
              <li>
                <b>Permettre une traçabilité</b> en cas de litige ou de problème
                grave (vol, agression…), et faciliter une éventuelle coopération
                avec les autorités, si nécessaire.
              </li>
            </ul>{" "}
            <br />
            <p className="m-0">
              <b>Ton nom complet n'est jamais rendu public automatiquement.</b>{" "}
              Tu peux choisir d'afficher ou non ton prénom dans ton profil.
            </p>
            {/* -- Données des mineurs et consentement numérique -- */}
            <p className="!font-bold mt-6 m-0 underline">
              Données des mineurs et consentement numérique
            </p>
            <p className="m-0">
              En France, le{" "}
              <b>seuil légal de consentement numérique est fixé à 15 ans</b>{" "}
              (article 45 de la loi Informatique et Libertés). Cela signifie
              que, dès cet âge, un(e) mineur(e) peut légalement accepter le
              traitement de ses données personnelles sans autorisation
              parentale.
            </p>
            <br />
            <p className="m-0">
              Cependant,{" "}
              <b>Localiz est réservée aux personnes âgées d'au moins 16</b>
              ans, pour des raisons de sécurité, de modération, et de
              responsabilité. Aucun compte ne peut être créé en dessous de cet
              âge.
            </p>
            <br />
            <p className="m-0">
              Si tu as <b>16 ou 17 ans</b>, tu peux :
            </p>
            <ul className="list-disc ml-5 mt-1">
              <li>Créer un compte sur Localiz,</li>
              <li>
                Fournir des informations personnelles (prénom, nom, email,
                ville…),
              </li>
              <li>Utiliser l'application comme n'importe quel autre membre.</li>
            </ul>
            <br />
            <p className="m-0">
              <b>Localiz s'engage à protéger ta vie privée.</b> Toutes tes
              données sont traitées avec la même rigueur que celles d'un adulte.
              Et, comme pour eux,{" "}
              <b>ton nom complet n'est jamais affiché publiquement</b>, et{" "}
              <b>ton prénom n'est visible que si tu choisis de le montrer</b>{" "}
              dans ton profil.
            </p>
            {/* -- Durée de conservation des données -- */}
            <p className="!font-bold mt-6 m-0 underline">
              Durée de conservation des données
            </p>
            <p className="m-0">
              Les données d'un compte sont conservées{" "}
              <b>tant qu'il est actif</b>.
            </p>{" "}
            <br />
            <p className="m-0">
              Si tu décides de supprimer ton compte, il sera d'abord{" "}
              <b>désactivé</b>. Cependant, les équipes Localiz y auront encore
              accès temporairement pour la gestion des litiges ou obligations
              légales. Ensuite, la <b>suppression définitive</b> interviendra
              dans un délai de <b>30 jours</b> après ta demande.
            </p>
            {/* -- (Moved) Droits des utilisateurs (now a top-level section) -- */}
            {/* -- (Moved) Politique relative aux cookies (now a top-level section) -- */}
          </div>
        </section>

        <section id="rights" className="mt-12 text-left" tabIndex={-1}>
          {/* === Droits des utilisateurs === */}
          <h2 className="text-2xl font-semibold font-quicksand uppercase mb-3 underline">
            Droits des utilisateurs
          </h2>
          <div>
            <p className="m-0">
              Conformément au RGPD, tu disposes de plusieurs droits concernant
              tes données :
            </p>
            <ul className="list-disc ml-5 mt-1">
              <li>
                <b>Droit d'accès</b> : obtenir une copie des données que nous
                détenons sur toi,
              </li>
              <li>
                <b>Droit de rectification</b> : corriger des données inexactes
                ou incomplètes,
              </li>
              <li>
                <b>Droit d'opposition</b> : t'opposer au traitement pour
                certains motifs,
              </li>
              <li>
                <b>Droit à l'effacement</b> : demander la suppression de tes
                données, sous conditions.
              </li>
            </ul>
            <p className="m-0 mt-4">
              Pour toute question ou pour exercer tes droits, tu peux nous
              contacter à l'adresse suivante :{" "}
              <a
                href="mailto:rgpd@localiz.fr"
                className="underline"
                aria-label="Envoyer un email à rgpd arobase localiz point fr"
              >
                rgpd@localiz.fr
              </a>
            </p>
          </div>
        </section>

        <section id="cookies" className="mt-12 mb-8 text-left" tabIndex={-1}>
          {/* === Politique relative aux cookies === */}
          <h2 className="text-2xl font-semibold font-quicksand uppercase mb-3 underline">
            Politique relative aux cookies
          </h2>
          <div>
            <p className="m-0">Localiz utilise des cookies pour :</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Mémoriser les préférences utilisateur</li>
              <li>Analyser l'usage de l'application</li>
              <li>Proposer du contenu ciblé</li>
            </ul>
            <p className="m-0 mt-4">
              Le consentement de l'utilisateur est requis à la première
              ouverture de l'application. Il peut être modifié dans la page{" "}
              <Link
                to="/settings/cookies"
                className="underline"
                aria-label="Ouvrir les paramètres des cookies"
              >
                Paramètres des cookies
              </Link>{" "}
              à tout moment.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
