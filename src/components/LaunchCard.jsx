import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { formatLaunchDate, getLaunchStatusBadge, getLaunchStatusText } from '../api';

/**
 * LaunchCard component that displays individual launch information
 */
const LaunchCard = ({ launch, onClick }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFavorited = isFavorite(launch.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    toggleFavorite(launch.id);
  };

  const handleCardClick = () => {
    onClick(launch);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className="card p-6 cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${launch.name}`}
    >
      {/* Header with favorite button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {launch.name || 'Unnamed Mission'}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {launch.rocketName || 'Unknown Rocket'}
          </p>
        </div>
        
        <button
          onClick={handleFavoriteClick}
          className={`ml-2 p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
            isFavorited 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-300 hover:text-yellow-500'
          }`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg 
            className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      </div>

      {/* Mission Patch */}
      {launch.links?.patch?.small && (
        <div className="flex justify-center mb-4">
          <img
            src={launch.links.patch.small}
            alt={`${launch.name} mission patch`}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Launch Date */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Launch Date:</span>
        </p>
        <p className="text-sm text-gray-900">
          {formatLaunchDate(launch.date_utc)}
        </p>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`${getLaunchStatusBadge(launch.success, launch.upcoming)}`}>
          {getLaunchStatusText(launch.success, launch.upcoming)}
        </span>
      </div>

      {/* Flight Number */}
      {launch.flight_number && (
        <div className="text-xs text-gray-500">
          Flight #{launch.flight_number}
        </div>
      )}

      {/* Click indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Click to view details
        </p>
      </div>
    </div>
  );
};

export default LaunchCard;
