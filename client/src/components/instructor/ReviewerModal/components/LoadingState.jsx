// components/ReviewerModal/components/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="w-full h-full px-20 py-5 space-y-6 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>

      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-3 pt-6">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;