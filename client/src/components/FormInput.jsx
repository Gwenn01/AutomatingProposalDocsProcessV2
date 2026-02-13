import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const FormInput = forwardRef(({
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  name,
  required = false,
  error = "",
  options = [],
  icon: Icon = null,
  disabled = false,
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const hasError = Boolean(error);

  return (
    <div className="w-full mb-4">
      <div
        className={`
          flex items-center gap-2 px-5 py-3 rounded-full border transition
          ${hasError ? "border-red-500" : "border-gray-300"}
          focus-within:ring-2
          ${hasError ? "focus-within:ring-red-400" : "focus-within:ring-secondary"}
          ${disabled ? "bg-gray-100" : "bg-white"}
        `}
      >
        {Icon && (
          <Icon
            size={18}
            className={hasError ? "text-red-500" : "text-gray-400"}
          />
        )}

        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-full bg-transparent outline-none text-sm"
          >
            <option value="">{placeholder}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={ref}
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="w-full bg-transparent outline-none text-md"
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-secondary"
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        )}
      </div>

      {hasError && (
        <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

export default FormInput;
