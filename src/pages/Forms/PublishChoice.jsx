import { Link } from "react-router-dom";
import BackLink from "../../components/Common/BackLink";

export default function PublishChoice() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BackLink to="/homepage" fixed />
      <h1
        className="text-3xl font-ui mb-4 font-bold"
        style={{ fontFamily: "Fredoka" }}
      >
        Publier
      </h1>
      <p className="mb-6" id="publish-intro">
        Choisissez ce que vous souhaitez publier :
      </p>
      <nav aria-label="Types de publication" className="mt-4">
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-describedby="publish-intro"
        >
          <li>
            <Link
              to="/deals/create"
              className="group flex items-center justify-center rounded-lg p-6 bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 text-center h-40"
              aria-describedby="deal-desc"
            >
              <h2 className="text-2xl font-semibold">Publier un bon plan</h2>
            </Link>
            <p id="deal-desc" className="sr-only">
              Publier un bon plan local: promotions, événements, réductions.
            </p>
          </li>
          <li>
            <Link
              to="/listings/create"
              className="group flex items-center justify-center rounded-lg p-6 bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 text-center h-40"
              aria-describedby="listing-desc"
            >
              <h2 className="text-2xl font-semibold">
                Publier une annonce
                <br />
                (troc ou don)
              </h2>
            </Link>
            <p id="listing-desc" className="sr-only">
              Publier une annonce d'objet à donner ou à échanger.
            </p>
          </li>
        </ul>
      </nav>
    </div>
  );
}
