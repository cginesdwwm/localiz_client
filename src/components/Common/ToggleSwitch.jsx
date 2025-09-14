import { forwardRef } from "react";

const ToggleSwitch = forwardRef(
  ({ id, checked, onChange, disabled = false, ariaLabel }, ref) => {
    return (
      <button
        id={id}
        ref={ref}
        role="switch"
        aria-checked={!!checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange && onChange(!checked);
          }
        }}
        className={`w-12 h-7 rounded-full p-[3px] flex items-center transition-colors duration-150 ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } ${checked ? "bg-blue-500" : "bg-gray-300"}`}
      >
        <span
          className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-150 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    );
  }
);

export default ToggleSwitch;
