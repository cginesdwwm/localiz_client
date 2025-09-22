/*
  Input.jsx
  - Composant input très simple utilisé pour les exemples.
  - Props:
    - type: type de l'input (text, password, email, ...)
  Remarque: ici les styles sont basiques; on peut étendre ce composant pour
  accepter value, onChange, placeholder, etc.
*/

import { forwardRef, useState } from "react";
import "./Input.css";

const Input = forwardRef(
  (
    {
      type = "text",
      id,
      name,
      value,
      onChange,
      placeholder,
      className = "",
      label,
      labelClassName,
      size = "sm", // "sm" | "base"
      error,
      required = false,
      autoComplete,
      ...rest
    },
    ref
  ) => {
    const [show, setShow] = useState(false);

    const isPassword = type === "password";

    const base =
      "w-full border px-3 input-surface placeholder-muted input-vert-center";
    const sizeClass =
      size === "base"
        ? "text-base placeholder:text-[15px]"
        : "text-sm placeholder:text-[15px]";
    const errorClass = error ? "border-yellow-400" : "border-gray-200";

    // When password field and using toggle, we wrap input + button
    if (isPassword) {
      return (
        <div className="mb-4">
          {label && (
            <label
              htmlFor={id || name}
              className={
                labelClassName ||
                `block ${
                  size === "base" ? "text-base" : "text-sm"
                } font-medium mb-1`
              }
            >
              {label}
              {required ? " *" : ""}
            </label>
          )}

          <div className="relative">
            <input
              id={id}
              name={name}
              ref={ref}
              type={show ? "text" : "password"}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={`${base} ${sizeClass} ${errorClass} ${className} pr-12`.trim()}
              aria-invalid={!!error}
              aria-describedby={error ? `${id || name}-error` : undefined}
              {...rest}
            />

            <button
              type="button"
              aria-pressed={show}
              title={
                show ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--text)] rounded"
            >
              <span className="sr-only">
                {show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              </span>
              {show ? (
                // eye-off icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.34-3.04 4.1-5.45 7.35-6.45" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                // eye icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <p id={`${id || name}-error`} className="text-xs mt-1 error-text">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={id || name}
            className={
              labelClassName ||
              `block ${
                size === "base" ? "text-base" : "text-sm"
              } font-medium mb-1`
            }
          >
            {label}
            {required ? " *" : ""}
          </label>
        )}
        <input
          id={id}
          name={name}
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${base} ${sizeClass} ${errorClass} ${className}`.trim()}
          aria-invalid={!!error}
          aria-describedby={error ? `${id || name}-error` : undefined}
          {...rest}
        />
        {error && (
          <p id={`${id || name}-error`} className="text-xs mt-1 error-text">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
