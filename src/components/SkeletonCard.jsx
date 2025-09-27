import React from 'react';

/**
 * SkeletonCard component for loading states
 */
const SkeletonCard = () => {
  return (
    <div className="card p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full ml-2"></div>
      </div>

      {/* Mission patch skeleton */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      </div>

      {/* Launch date skeleton */}
      <div className="mb-4">
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Status badge skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>

      {/* Flight number skeleton */}
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>

      {/* Click indicator skeleton */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
