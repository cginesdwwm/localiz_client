// PAGE A PROPOS DE LOCALIZ
import BackLink from "../../components/Common/BackLink";
import faviconLocal from "../../assets/images/favicon.png";

const SUPABASE_FAVICON =
  "https://pjrrvzxomdowrraykone.supabase.co/storage/v1/object/public/public-assets/favicon.png";

export default function About() {
  return (
    <div>
      <div className="mb-4">
        <BackLink to="/settings" fixed />
      </div>

      <div className="p-12">
        <h1
          className="text-3xl heading text-center mt-[-2rem] font-bold"
          style={{
            fontFamily: "Fredoka",
            color: "#F4EBD6",
          }}
        >
          À propos de Localiz
        </h1>

        <div className="flex justify-center">
          <img
            src={SUPABASE_FAVICON}
            alt="Localiz logo"
            width={120}
            height={120}
            className="object-contain"
            onError={(e) => {
              if (e?.currentTarget) e.currentTarget.src = faviconLocal;
            }}
          />
        </div>

        <header>
          <h1
            className="text-3xl heading text-center mt-[-2rem] font-bold"
            style={{
              fontFamily: "Fredoka",
              color: "#F4EBD6",
            }}
          >
            Localiz
          </h1>
          <p
            className="heading text-center"
            style={{ fontWeight: 500, fontSize: "20px", fontFamily: "Fredoka" }}
          >
            Les bons plans, à vol d'oiseau
          </p>
        </header>
        <main className="p-5 space-y-8 text-left">
          <section>
            <h2 className="text-2xl font-semibold font-quicksand underline">
              Notre mission
            </h2>
            <div className="body-text mt-2 space-y-3">
              <p>
                Localiz est une application mobile citoyenne qui connecte les
                habitants d'un même territoire autour d'un objectif commun :{" "}
                <strong>partager, échanger, recycler et s'entraider</strong>.
                <br /> Dans un monde où tout va vite et où l'on jette trop, nous
                croyons à la puissance du <strong>lien local</strong>, de la{" "}
                <strong>consommation responsable</strong> et du{" "}
                <strong>bon sens collectif</strong>.
              </p>

              <p>
                Grâce à Localiz, tu peux :
                <ul className="list-disc ml-6 mt-2">
                  <li>
                    découvrir des <strong>bons plans locaux</strong> (offres
                    spéciales, événements de quartier, soirées, concerts,
                    vide-greniers, etc.),
                  </li>
                  <li>
                    <strong>donner, troquer ou recycler</strong> tes objets du
                    quotidien,
                  </li>
                  <li>
                    trouver des <strong>idées d'upcycling</strong> à réaliser
                    toi-même, ou en proposer,
                  </li>
                  <li>
                    et <strong>rencontrer des gens près de chez toi</strong> qui
                    partagent ces mêmes envies.
                  </li>
                </ul>
              </p>

              <p>
                En gros, nous sommes là pour{" "}
                <strong>créer du lien social, réduire le gaspillage</strong> et{" "}
                <strong>encourager le partage solidaire</strong>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold font-quicksand underline">
              Qui sommes-nous ?
            </h2>
            <div className="body-text mt-2 space-y-2">
              <p>
                Née de l'esprit solidaire et créatif des Hauts-de-France,{" "}
                <strong>Localiz</strong> n'est pas qu'une simple application :{" "}
                <b>c'est un projet de cœur</b>. Ici, l'entraide n'est pas une
                valeur théorique, elle est le moteur de notre quotidien. C'est
                dans ce terreau de générosité et de convivialité que notre
                équipe, profondément attachée à sa région, a imaginé un outil au
                service de ses habitants.
              </p>

              <p>
                <strong>Localiz</strong> a été conçue pour tisser des liens
                solides entre voisins, pour transformer les "petits gestes" du
                quotidien en un grand élan collectif. Notre mission est de
                simplifier les échanges, de valoriser les initiatives
                écologiques et de redonner vie aux objets grâce au réemploi
                créatif. En rejoignant Localiz, vous ne téléchargez pas
                seulement une application, vous rejoignez une{" "}
                <strong>communauté</strong> engagée à rendre son quartier plus
                durable, plus solidaire et plus chaleureux. C'est{" "}
                <strong>l'entraide</strong> qui se vit au coin de la rue,{" "}
                <strong>l'intelligence collective</strong> qui s'organise et le{" "}
                <strong>lien de proximité</strong> qui se renforce.
              </p>

              <p>
                Ici, l'<b>entraide ne s'apprend pas : elle se vit</b>.
                L'application a été pensée pour
                <b> simplifier les échanges</b> entre voisins,{" "}
                <strong>valoriser les petits gestes écolos</strong>, et{" "}
                <strong>encourager le réemploi créatif</strong>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold font-quicksand underline">
              Nos valeurs
            </h2>
            <div className="body-text mt-2 space-y-2">
              <ul className="list-disc ml-6">
                <li>
                  <strong className="strong-normal">Écoresponsabilité</strong>
                </li>
                <li>
                  <strong className="strong-normal">Solidarité</strong>
                </li>
                <li>
                  <strong className="strong-normal">Proximité</strong>
                </li>
                <li>
                  <strong className="strong-normal">Ingéniosité</strong>
                </li>
                <li>
                  <strong className="strong-normal">Accessibilité</strong>
                </li>
              </ul>

              <p>
                Nous croyons que <b>chaque objet a plusieurs vies</b>.<br />
                Que chaque quartier <b>regorge de bonnes idées</b>.<br />
                Que le numérique peut aussi <b>servir le lien humain</b>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold font-quicksand underline">
              Les fonctionnalités phares de Localiz
            </h2>
            <div className="body-text mt-2">
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Poster une annonce</strong> en quelques clics
                </li>
                <li>
                  <strong>Repérer facilement les bons plans</strong> autour de
                  toi
                </li>
                <li>
                  <strong>Partager</strong> ce dont tu n'as plus besoin
                </li>
                <li>
                  <strong>Trouver des objets ou idées utiles</strong>
                </li>
                <li>
                  Participer à une dynamique{" "}
                  <strong>d'upcycling et d'économie circulaire</strong>
                </li>
                <li>
                  <strong>Discuter et échanger</strong> via une messagerie
                  intégrée <span className="text-current">(à venir !)</span>
                </li>
                <li>
                  Gérer ses préférences et <strong>être notifié</strong> en
                  temps réel
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold font-quicksand underline">
              Notre engagement
            </h2>
            <div className="body-text mt-2">
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  Une application <b>100% gratuite</b>
                </li>
                <li>Sans publicité intrusive</li>
                <li>Hébergée en Europe</li>
                <li>
                  Pensée pour les <b>besoins locaux et durables</b>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold font-quicksand underline">
              Contact / Suggestions
            </h2>
            <p className="body-text mt-2">
              Une idée ? Un bug à signaler ? Une envie de collaborer ? <br />
              Écris-nous à :{" "}
              <a
                className="underline text-current"
                href="mailto:support@localiz.fr"
              >
                <strong>support@localiz.fr</strong>
              </a>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
