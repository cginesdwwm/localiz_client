import React from "react";

/**
 * Reusable Button component that maps `variant` to theme-aware CSS classes.
 * Variants: 'cta' | 'danger' | 'filter' | 'ghost'
 */
export default function Button({
  children,
  variant = "cta",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const variantMap = {
    cta: "btn btn-cta",
    danger: "btn btn-danger",
    filter: "btn btn-filter",
    ghost: "btn btn-ghost",
  };

  const base = variantMap[variant] || variantMap.cta;

  return (
    <button
      type={type}
      className={`${base} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
// />;

// How to use

// Import and use instead of raw <button>:
// <Button variant="cta">Get started</Button>
// <Button variant="danger" onClick={deleteSomething}>Delete</Button>
// <Button variant="filter" className="ml-2">Filters</Button>
// <Button variant="ghost">Check</Button>
