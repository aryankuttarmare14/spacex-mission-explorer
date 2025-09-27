import React from 'react';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Header component with title and search functionality
 */
const Header = ({ searchQuery, onSearchChange }) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update parent component with debounced search query
  React.useEffect(() => {
    onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title and Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spacex-blue rounded-lg flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 2L3 7v11h14V7l-7-5zM8 15V9h4v6H8z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                SpaceX Mission Explorer
              </h1>
              <p className="text-sm text-gray-600">
                Explore SpaceX launches and missions
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search missions or rockets..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="input-field pl-10 pr-4 py-2"
              aria-label="Search missions and rockets"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
