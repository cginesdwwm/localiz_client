/*
  Input.jsx
  - Composant input très simple utilisé pour les exemples.
  - Props:
    - type: type de l'input (text, password, email, ...)
  Remarque: ici les styles sont basiques; on peut étendre ce composant pour
  accepter value, onChange, placeholder, etc.
*/

import { forwardRef } from "react";

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
      error,
      required = false,
      autoComplete,
      ...rest
    },
    ref
  ) => {
    const base =
      "w-full rounded border px-3 py-2 text-sm input-surface placeholder-muted placeholder:text-[15px] h-12";
    const errorClass = error ? "border-yellow-400" : "border-gray-200";

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={id || name}
            className="block text-sm font-medium mb-1"
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
          className={`${base} ${errorClass} ${className}`.trim()}
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
