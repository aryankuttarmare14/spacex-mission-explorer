import React, { useEffect, useRef } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { formatLaunchDate, getLaunchStatusBadge, getLaunchStatusText } from '../api';

/**
 * LaunchModal component that displays detailed launch information in a modal
 */
const LaunchModal = ({ launch, onClose }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const modalRef = useRef(null);
  const isFavorited = isFavorite(launch.id);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus management
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFavoriteClick = () => {
    toggleFavorite(launch.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
            {launch.name || 'Unnamed Mission'}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                isFavorited 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-gray-300 hover:text-yellow-500'
              }`}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg 
                className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Mission Details */}
            <div className="space-y-6">
              {/* Mission Patch */}
              {launch.links?.patch?.large && (
                <div className="text-center">
                  <img
                    src={launch.links.patch.large}
                    alt={`${launch.name} mission patch`}
                    className="w-32 h-32 object-contain mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Mission Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission Status</h3>
                <span className={`${getLaunchStatusBadge(launch.success, launch.upcoming)} text-sm`}>
                  {getLaunchStatusText(launch.success, launch.upcoming)}
                </span>
              </div>

              {/* Launch Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Launch Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Launch Date:</dt>
                    <dd className="text-sm text-gray-900">{formatLaunchDate(launch.date_utc)}</dd>
                  </div>
                  {launch.flight_number && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-600">Flight Number:</dt>
                      <dd className="text-sm text-gray-900">{launch.flight_number}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Rocket:</dt>
                    <dd className="text-sm text-gray-900">{launch.rocketName || 'Unknown'}</dd>
                  </div>
                  {launch.launchpad && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-600">Launch Site:</dt>
                      <dd className="text-sm text-gray-900">{launch.launchpad}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Mission Description */}
              {launch.details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{launch.details}</p>
                </div>
              )}
            </div>

            {/* Right Column - Links and Additional Info */}
            <div className="space-y-6">
              {/* Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
                <div className="space-y-3">
                  {launch.links?.wikipedia && (
                    <a
                      href={launch.links.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11h14V7l-7-5zM8 15V9h4v6H8z"/>
                      </svg>
                      Wikipedia Article
                    </a>
                  )}
                  {launch.links?.webcast && (
                    <a
                      href={launch.links.webcast}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                      Watch Webcast
                    </a>
                  )}
                  {launch.links?.article && (
                    <a
                      href={launch.links.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                      </svg>
                      Press Kit
                    </a>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              {launch.links?.flickr?.original && launch.links.flickr.original.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission Photos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {launch.links.flickr.original.slice(0, 4).map((image, index) => (
                      <a
                        key={index}
                        href={image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={image}
                          alt={`${launch.name} mission photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition-opacity duration-200"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaunchModal;
