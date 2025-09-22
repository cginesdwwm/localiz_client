import { Link } from "react-router-dom";
import BackLink from "../../components/Common/BackLink";

export default function PublishChoice() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BackLink to="/" fixed />
      <h1
        className="text-3xl font-ui mb-4 font-bold"
        style={{ fontFamily: "Fredoka" }}
      >
        Publier
      </h1>
      <p className="mb-6">Choisissez ce que vous souhaitez publier :</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/listings/create"
          className="flex items-center justify-center rounded-lg p-6 bg-white/5 hover:bg-white/10 text-center"
        >
          <h2 className="text-2xl font-semibold">
            Publier une annonce (Troc/Don)
          </h2>
        </Link>

        <Link
          to="/deals/create"
          className="flex items-center justify-center rounded-lg p-6 bg-white/5 hover:bg-white/10 text-center"
        >
          <h2 className="text-2xl font-semibold">Publier un bon plan</h2>
        </Link>
      </div>
    </div>
  );
}
