import React from "react";

interface FormSkeletonProps {
  lines?: number;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({ lines = 6 }) => {
  return (
    <div className="animate-pulse space-y-6">

      {/* Title Placeholder */}
      <div className="space-y-3">
        <div className="h-6 w-1/3 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-1/4 bg-gray-100 rounded-md"></div>
      </div>

      {/* Form Fields */}
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
        </div>
      ))}

      {/* Button Placeholder */}
      <div className="flex justify-end pt-4">
        <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
      </div>

    </div>
  );
};

export default FormSkeleton;