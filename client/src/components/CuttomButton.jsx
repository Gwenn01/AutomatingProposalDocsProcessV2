import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  loadingText
}) => {
  return (
    <button
      onClick={handlePress}
      disabled={isLoading}
      className={`
        bg-secondary rounded-3xl min-h-[40px] px-4 flex items-center justify-center w-full
        transition-opacity
        ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}
        ${containerStyles}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-white font-bold">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </div>
      ) : (
        <span className={`text-white font-bold text-md ${textStyles}`}>
          {title}
        </span>
      )}
    </button>
  );
};

export default CustomButton;
