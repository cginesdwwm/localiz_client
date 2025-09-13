import { NavLink } from "react-router-dom";

export default function BackLink({ to, label, className = "" }) {
  // Fixed position top-left with some padding
  return (
    <div
      className={`fixed top-4 left-4 z-50 flex items-center gap-3 ${className}`.trim()}
    >
      <NavLink
        to={to || -1}
        aria-label={`Retour vers ${label || "la page précédente"}`}
        className="p-2 flex items-center justify-center"
      >
        <span className="text-white text-3xl leading-none" aria-hidden>
          ←
        </span>
      </NavLink>

      <span className="backlink pointer-events-none text-[var(--text)]">
        {label}
      </span>
    </div>
  );
}
