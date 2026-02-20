import React from "react";

interface LoadingProps {
  title?: string;
  subtitle?: string;
  progress?: number;
}

const Loading: React.FC<LoadingProps> = ({
  title = "Loading",
  subtitle = "Please wait...",
  progress = 0,
}) => {
  return (
    <div className="w-full h-full bg-white inset-0 z-[60] flex items-center justify-center backdrop-blur-md animate-fade-in">
      <div className="relative bg-white px-14 py-10 flex flex-col items-center animate-pop-out w-[450px]">
        <p className="text-lg font-semibold shimmer-text mb-2 text-center">
          {title}
        </p>
        <p className="text-xs w-full text-gray-500 mb-4 text-center">
          {subtitle}
        </p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 font-medium">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
};

export default Loading;
