import { NavLink } from "react-router-dom";

export default function BackLink({
  to,
  label,
  className = "",
  fixed = true,
  arrowOnly = true,
}) {
  // Default position: fixed at top-left of viewport
  const positionClass = fixed
    ? "fixed top-6 left-6 z-50"
    : "absolute top-6 left-6 z-40";

  // When arrowOnly is true, render the arrow as the interactive NavLink
  // and render the label as non-interactive text (but still accessible).
  if (arrowOnly) {
    return (
      <div className={`${positionClass} flex items-center ${className}`.trim()}>
        <NavLink
          to={to || -1}
          aria-label={label ? `Retour vers ${label}` : "Retour"}
          className="backlink-link p-0 flex items-center"
        >
          <span className="text-white text-3xl leading-none" aria-hidden>
            ←
          </span>
        </NavLink>

        {/*
          The visible label is hidden from assistive technology because the
          interactive arrow link already provides an `aria-label` announcing
          the destination. Hiding the visual label prevents duplicate
          announcements for screen reader users while keeping the text
          readable visually.
        */}
        <span className="ml-2 backlink backlink-text" aria-hidden={true}>
          {label}
        </span>
      </div>
    );
  }

  // Default behavior: whole area is clickable
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

        <span className="pointer-events-none ml-2 backlink backlink-text">
          {label}
        </span>
      </NavLink>
    </div>
  );
}
