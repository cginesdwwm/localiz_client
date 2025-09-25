/**
 * PAGE INFORMATIONS LEGALES
 *
 * Rôle: Regroupe Mentions légales, CGU, Politique de confidentialité,
 * Droits des utilisateurs et Politique des cookies.
 *
 * Accessibilité: Page rendue dans <main id="main-content">. Skip links,
 * aria-labelledby sur sections, focus déplacé vers l’ancre ciblée, titres
 * harmonisés (Mulish/underline pour h3).
 */

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
        // move focus for better a11y
        const prevTabIndex = el.getAttribute("tabindex");
        if (prevTabIndex === null) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
        // cleanup: restore previous tabindex if it wasn't set
        if (prevTabIndex === null) {
          el.addEventListener(
            "blur",
            () => {
              el.removeAttribute("tabindex");
            },
            { once: true }
          );
        }
      }
    }, 60);
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return (
    <div className="p-10 mx-auto">
      {/* Skip links for keyboard users */}
      <nav aria-label="Liens d'évitement">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:rounded focus:shadow focus:px-3 focus:py-2"
        >
          Aller au contenu
        </a>
        <a
          href="#mentions-section"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:rounded focus:shadow focus:px-3 focus:py-2"
        >
          Aller aux mentions légales
        </a>
        <a
          href="#cgu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:rounded focus:shadow focus:px-3 focus:py-2"
        >
          Aller aux CGU
        </a>
        <a
          href="#privacy"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:rounded focus:shadow focus:px-3 focus:py-2"
        >
          Aller à la politique de confidentialité
        </a>
        <a
          href="#rights"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:rounded focus:shadow focus:px-3 focus:py-2"
        >
          Aller aux droits des utilisateurs
        </a>
        <a
          href="#cookies"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:rounded focus:shadow focus:px-3 focus:py-2"
        >
          Aller à la politique cookies
        </a>
      </nav>
      <BackLink to="/settings" fixed />

      <div className="p-12">
        <h1
          className="text-3xl font-quicksand !font-bold mb-4"
          style={{ color: "#F4EBD6", fontFamily: "Fredoka" }}
          ref={headingRef}
        >
          Informations légales
        </h1>

        <section
          className="mt-4 text-left"
          tabIndex={-1}
          id="mentions-section"
          aria-labelledby="mentions"
        >
          {/* === Mentions légales === */}
          <h2
            id="mentions"
            className="text-2xl font-semibold font-quicksand uppercase mb-2 underline"
          >
            Mentions légales
          </h2>
          <p className="text-sm text-gray-500 mb-2">En vigueur au 25/09/2025</p>
          <p className="mb-2">
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004
            pour la Confiance en l'économie numérique, il est porté à la
            connaissance des utilisateurs et visiteurs, ci-après l' "
            <b>Utilisateur</b>", du site{" "}
            <a
              href="https://localizdwwm.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://localizdwwm.netlify.app
            </a>{" "}
            , ci-après le "<b>Site</b>", les présentes mentions légales.
          </p>
          <p className="mb-2">
            La connexion et la navigation sur le Site par l'Utilisateur implique
            l'acceptation intégrale et sans réserve des présentes mentions
            légales.{" "}
          </p>
          <p className="mb-6">Ces dernières sont accessibles sur cette page.</p>
          <div>
            {/* -- Éditeur de l'application -- */}
            <h3
              className="text-lg font-semibold m-0 underline"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Éditeur de l'application
            </h3>
            <p className="m-0">
              L'édition du Site est assurée par la société Localiz, Association
              loi 1901 au capital de 5000 euros, immatriculée au Registre du
              Commerce et des Sociétés de Béthune sous le numéro 012345678 dont
              le siège social est situé au 6 Rue Sadi Carnot, 62400 Béthune,
            </p>
            <br />
            <p className="m-0">
              <b>{">"} Numéro de téléphone : </b>
              <a
                href="tel:0612345678"
                className="underline"
                aria-label="Appeler Localiz au plus zéro six douze trente quatre cinquante six soixante dix huit"
              >
                06 12 34 56 78
              </a>
            </p>
            <address className="m-0 not-italic">
              <b>{">"} Email de contact : </b>
              <a
                href="mailto:contact@localiz.fr"
                className="underline"
                aria-label="Envoyer un email à contact arobase localiz point fr"
              >
                contact@localiz.fr
              </a>
            </address>
            <p>
              <b>{">"} N° de TVA intracommunautaire : </b> 0123456789
            </p>
            <p className="m-0">
              <b>{">"} Directrice de la publication : </b> GINES Chloé
            </p>
            <br />
            <p>
              ci-après l'"<b>Editeur</b>".
            </p>

            {/* -- Hébergement -- */}
            <h3
              className="mt-6 text-lg font-semibold m-0 underline"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Hébergeur
            </h3>
            <p>
              L'hébergeur du Site est la société Netlify, dont le siège social
              est situé au 512 2nd Street, Suite 200, CA 94104, San Francisco.
            </p>

            <h3
              className="mt-6 text-lg font-semibold m-0 underline"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Accès au site
            </h3>
            <p>
              Le Site est normalement accessible, à tout moment, à
              l'Utilisateur. Toutefois, l'Editeur pourra, à tout moment,
              suspendre, limiter ou interrompre le Site afin de procéder,
              notamment, à des mises à jour ou des modifications de son contenu.
              L'Editeur ne pourra en aucun cas être tenu responsable des
              conséquences éventuelles de cette indisponibilité sur les
              activités de l'Utilisateur.
            </p>

            <h3
              className="mt-6 text-lg font-semibold m-0 underline"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Collecte des données
            </h3>
            <p>
              Le Site assure à l'Utilisateur une collecte et un traitement des
              données personnelles dans le respect de la vie privée conformément
              à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux
              fichiers et aux libertés et dans le respect de la réglementation
              applicable en matière de traitement des données à caractère
              personnel conformément au règlement (UE) 2016/679 du Parlement
              européen et du Conseil du 27 avril 2016 (ci-après, ensemble, la "
              <b>
                Règlementation applicable en matière de protection des Données à
                caractère personnel
              </b>
              ").
            </p>
            <br />
            <p>
              En vertu de la Règlementation applicable en matière de protection
              des Données à caractère personnel, l'Utilisateur dispose d'un
              droit d'accès, de rectification, de suppression et d'opposition de
              ses données personnelles. L'Utilisateur peut exercer ce droit :
            </p>
            <ul
              className="mt-2 mb-2 list-disc list-inside"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              <li>par mail à l'adresse email contact@localiz.fr ;</li>
              <li>par voie postale au 6 Rue Sadi Carnot, 62400 Béthune ;</li>
              <li>depuis le formulaire de contact ;</li>
              <li>depuis son espace personnel ;</li>
            </ul>
            <p>
              Toute utilisation, reproduction, diffusion, commercialisation,
              modification de toute ou partie du Site, sans autorisation
              expresse de l'Editeur est prohibée et pourra entraîner des actions
              et poursuites judiciaires telles que prévues par la réglementation
              en vigueur.
            </p>
            <br />
            <p>
              Pour plus d'informations, se reporter aux CGU du site ci-dessous.
            </p>
            <p>
              Pour plus d'informations en matière de protection des données à
              caractère personnel, se reporter à la Politique de confidentialité
              ci-dessous.
            </p>
            <p>
              Pour plus d'informations en matière de cookies, se reporter à la
              Charte en matière de cookies du site à l'adresse{" "}
              <Link
                to="/settings/cookies"
                className="underline"
                aria-label="Ouvrir les paramètres des cookies"
              >
                https://localizdwwm.netlify.app/settings/cookies
              </Link>
              .
            </p>
          </div>
        </section>

        <section
          id="cgu"
          className="mt-12 text-left"
          tabIndex={-1}
          aria-labelledby="cgu-heading"
        >
          {/* === Conditions générales d'utilisation (CGU) === */}
          <h2
            id="cgu-heading"
            className="text-2xl font-semibold font-quicksand uppercase mb-3 underline"
          >
            Conditions générales d'utilisation (CGU)
          </h2>
          <div>
            {/* -- Objet -- */}
            <div>
              <h3
                className="text-lg font-semibold m-0 underline"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Objet
              </h3>
              <p className="m-0">
                Les présentes conditions ont pour but de définir les modalités
                d'utilisation de l'application Localiz.
              </p>
            </div>

            <div>
              {/* -- Services proposés -- */}
              <h3
                className="text-lg font-semibold mt-6 underline"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Services proposés
              </h3>
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
              <h3
                className="text-lg font-semibold mt-6 underline"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Inscription
              </h3>
              <p className="m-0">
                L'accès aux fonctionnalités de publication nécessite la création
                d'un compte utilisateur. Les utilisateurs doivent fournir des
                informations exactes et tenir à jour leur profil.
              </p>
            </div>

            <div>
              {/* -- Âge minimum requis -- */}
              <h3
                className="text-lg font-semibold mt-6 underline"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Âge minimum requis
              </h3>
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
              <h3
                className="text-lg font-semibold mt-6 underline"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Suppression de compte
              </h3>
              <p className="m-0">
                L'utilisateur peut supprimer son compte à tout moment via les
                paramètres de l'application.
              </p>
            </div>

            <div>
              {/* -- Responsabilité de l'utilisateur -- */}
              <h3
                className="text-lg font-semibold mt-6 underline"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Responsabilité de l'utilisateur
              </h3>
              <p className="m-0">
                Les utilisateurs s'engagent à ne pas publier de contenus
                illicites, haineux, violents ou portant atteinte aux droits
                d'autrui.
              </p>
            </div>

            <div>
              {/* -- Sécurité lors des échanges physiques -- */}
              <h3
                className="text-lg font-semibold mt-6 underline"
                style={{ fontFamily: "Mulish, sans-serif" }}
              >
                Sécurité lors des échanges physiques
              </h3>
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

        <section
          id="privacy"
          className="mt-12 text-left"
          tabIndex={-1}
          aria-labelledby="privacy-heading"
        >
          {/* === Politique de confidentialité === */}
          <h2
            id="privacy-heading"
            className="text-2xl font-semibold font-quicksand uppercase mb-3 underline"
          >
            Politique de confidentialité
          </h2>
          <div>
            <p className="m-0">
              Chez <strong>Localiz</strong>, nous nous engageons à protéger les
              données personnelles de nos utilisateurs et à les utiliser de
              manière transparente, éthique et conforme au Règlement Général sur
              la Protection des Données (RGPD).
            </p>
            <h3
              className="!font-bold mt-6 m-0 underline text-lg"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Données collectées
            </h3>
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
            <h3
              className="!font-bold mt-6 m-0 underline text-lg"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Finalités d'utilisation
            </h3>
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
            <h3
              className="!font-bold mt-6 m-0 underline text-lg"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Base légale du traitement
            </h3>
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
            <h3
              className="!font-bold mt-6 m-0 underline text-lg"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Pourquoi demandons-nous le nom et le prénom ?
            </h3>
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
            <h3
              className="!font-bold mt-6 m-0 underline text-lg"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Données des mineurs et consentement numérique
            </h3>
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
            <h3
              className="!font-bold mt-6 m-0 underline text-lg"
              style={{ fontFamily: "Mulish, sans-serif" }}
            >
              Durée de conservation des données
            </h3>
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

        <section
          id="rights"
          className="mt-12 text-left"
          tabIndex={-1}
          aria-labelledby="rights-heading"
        >
          {/* === Droits des utilisateurs === */}
          <h2
            id="rights-heading"
            className="text-2xl font-semibold font-quicksand uppercase mb-3 underline"
          >
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

        <section
          id="cookies"
          className="mt-12 mb-8 text-left"
          tabIndex={-1}
          aria-labelledby="cookies-heading"
        >
          {/* === Politique relative aux cookies === */}
          <h2
            id="cookies-heading"
            className="text-2xl font-semibold font-quicksand uppercase mb-3 underline"
          >
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
    </div>
  );
}
