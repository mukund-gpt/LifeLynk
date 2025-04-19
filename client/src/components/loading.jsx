import React from 'react';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-75">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-medium text-gray-700">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
