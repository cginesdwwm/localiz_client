import { Link } from "react-router-dom";

export default function PublishChoice() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-ui mb-4">Publier</h1>
      <p className="mb-6">Choisissez ce que vous souhaitez publier :</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/listings/create"
          className="block rounded-lg p-6 bg-white/5 hover:bg-white/10 text-center"
        >
          <h2 className="text-lg font-semibold">
            Publier une annonce (Troc/Don)
          </h2>
          <p className="mt-2 text-sm">Créer un listing pour troc ou don.</p>
        </Link>

        <Link
          to="/deals/create"
          className="block rounded-lg p-6 bg-white/5 hover:bg-white/10 text-center"
        >
          <h2 className="text-lg font-semibold">Publier un bon plan</h2>
          <p className="mt-2 text-sm">Publier une offre commerciale.</p>
        </Link>
      </div>
    </div>
  );
}
