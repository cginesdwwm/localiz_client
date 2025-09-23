import { forwardRef } from "react";
import "./Checkbox.css";

const Checkbox = forwardRef(
  (
    { id, checked, onChange, className = "", label, ariaLabel, ...rest },
    ref
  ) => {
    return (
      <div className={`flex items-center ${className}`.trim()}>
        <label htmlFor={id} className="flex items-center cursor-pointer">
          <input
            id={id}
            ref={ref}
            aria-label={ariaLabel}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...rest}
          />

          <span
            aria-hidden
            className={`checkbox-box ${
              checked ? "checkbox-box--checked" : ""
            } w-5 h-5 rounded-[5px] flex items-center justify-center transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 peer-focus-visible:ring-offset-1`}
          >
            <svg
              className={`w-3 h-3 transition-colors duration-150`}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                color: checked ? "var(--checkbox-checkmark)" : "transparent",
              }}
            >
              <path
                d="M4 10l3 3 9-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {label && <span className="ml-3 text-sm">{label}</span>}
        </label>
      </div>
    );
  }
);

export default Checkbox;
