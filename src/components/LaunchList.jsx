import React, { useMemo } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import LaunchCard from './LaunchCard';
import SkeletonCard from './SkeletonCard';

/**
 * LaunchList component that displays a grid of launch cards
 */
const LaunchList = ({ launches, showFavoritesOnly, onLaunchSelect }) => {
  const { isFavorite } = useFavorites();

  // Filter launches based on favorites if needed
  const filteredLaunches = useMemo(() => {
    if (!showFavoritesOnly) {
      return launches;
    }
    return launches.filter(launch => isFavorite(launch.id));
  }, [launches, showFavoritesOnly, isFavorite]);

  // Show skeleton loading state
  if (launches.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (filteredLaunches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg 
            className="w-16 h-16 text-gray-400 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {showFavoritesOnly ? 'No Favorite Launches' : 'No Launches Found'}
          </h3>
          <p className="text-gray-600">
            {showFavoritesOnly 
              ? 'You haven\'t marked any launches as favorites yet. Click the star icon on any launch to add it to your favorites.'
              : 'Try adjusting your search criteria or filters to find more launches.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredLaunches.length} of {launches.length} launches
          {showFavoritesOnly && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg 
                className="w-3 h-3 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Favorites
            </span>
          )}
        </p>
      </div>

      {/* Launch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLaunches.map((launch) => (
          <LaunchCard
            key={launch.id}
            launch={launch}
            onClick={() => onLaunchSelect(launch)}
          />
        ))}
      </div>
    </div>
  );
};

export default LaunchList;
