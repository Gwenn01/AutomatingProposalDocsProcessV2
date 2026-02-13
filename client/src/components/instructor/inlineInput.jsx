import { useRef, useEffect } from "react";

const InlineInput = ({
  type,
  value = "",
  onChange,
  placeholder,
  minWidth = 120,
  maxWidth = 600,
  className = ""
}) => {
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const width = spanRef.current.offsetWidth + 16;
      inputRef.current.style.width = `${Math.min(
        Math.max(width, minWidth),
        maxWidth
      )}px`;
    }
  }, [value, placeholder, minWidth, maxWidth]);

  return (
    <span className="inline-block relative align-baseline">
      {/* Hidden text measurer */}
      <span
        ref={spanRef}
        className="absolute invisible whitespace-pre font-medium px-1"
      >
        {value || placeholder}
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          border-b border-gray-300
          focus:border-red-500
          outline-none
          text-red-600
          placeholder-red-400
          font-medium
          px-1
          bg-transparent
          transition-[width,border-color]
          duration-200
          ${className}
        `}
        style={{ width: minWidth }}
      />
    </span>
  );
};

export default InlineInput;
