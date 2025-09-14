import { NavLink } from "react-router-dom";

export default function BackLink({ to, label, className = "", fixed = false }) {
  // Default: place BackLink at the top-left of the page content.
  // We don't want it to follow on scroll; use absolute positioning inside
  // the page container. If `fixed={true}` is passed, fall back to viewport-fixed.
  const positionClass = fixed
    ? "fixed top-6 left-6 z-50"
    : "absolute top-6 left-6 z-40";

  return (
    <div className={`${positionClass} flex items-center ${className}`.trim()}>
      <NavLink
        to={to || -1}
        aria-label={label ? `Retour vers ${label}` : "Retour"}
        className="p-0 flex items-center"
      >
        <span className="text-white text-3xl leading-none" aria-hidden>
          ←
        </span>
      </NavLink>

      <span className="backlink pointer-events-none ml-2 text-[var(--text)]">
        {label}
      </span>
    </div>
  );
}
