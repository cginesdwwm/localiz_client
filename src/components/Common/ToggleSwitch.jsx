import { forwardRef } from "react";

const ToggleSwitch = forwardRef(
  ({ id, checked, onChange, disabled = false, ariaLabel, ...rest }, ref) => {
    return (
      <button
        id={id}
        ref={ref}
        role="switch"
        aria-checked={!!checked}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        {...rest}
        onClick={() => !disabled && onChange && onChange(!checked)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange && onChange(!checked);
          }
        }}
        className={`w-12 h-7 rounded-full p-[3px] flex items-center ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          backgroundColor: checked
            ? "var(--btn-cta-bg)"
            : "var(--checkbox-unchecked-bg)",
          transition: "background-color 300ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <span
          className={`bg-white w-5 h-5 rounded-full shadow`}
          style={{
            transform: checked
              ? "translateX(20px) scale(1)"
              : "translateX(0) scale(.95)",
            transition: "transform 300ms cubic-bezier(.4,0,.2,1)",
            willChange: "transform",
          }}
        />
      </button>
    );
  }
);

export default ToggleSwitch;
