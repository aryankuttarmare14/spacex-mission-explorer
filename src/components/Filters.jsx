import React from 'react';

/**
 * Filters component for year selection, success filter, and favorites filter
 */
const Filters = ({
  availableYears,
  selectedYear,
  onYearChange,
  showSuccessfulOnly,
  onSuccessfulOnlyChange,
  showFavoritesOnly,
  onFavoritesOnlyChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Year Filter */}
        <div className="flex-1">
          <label 
            htmlFor="year-filter" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Year
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="input-field"
            aria-label="Filter launches by year"
          >
            <option value="">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Success Filter */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSuccessfulOnly}
              onChange={(e) => onSuccessfulOnlyChange(e.target.checked)}
              className="w-4 h-4 text-spacex-blue bg-gray-100 border-gray-300 rounded focus:ring-spacex-blue focus:ring-2"
              aria-describedby="success-filter-description"
            />
            <span className="text-sm font-medium text-gray-700">
              Successful launches only
            </span>
          </label>
          <div id="success-filter-description" className="sr-only">
            Toggle to show only successful launches
          </div>
        </div>

        {/* Favorites Filter */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => onFavoritesOnlyChange(e.target.checked)}
              className="w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
              aria-describedby="favorites-filter-description"
            />
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <svg 
                className="w-4 h-4 text-yellow-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Favorites only
            </span>
          </label>
          <div id="favorites-filter-description" className="sr-only">
            Toggle to show only favorited launches
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedYear || showSuccessfulOnly || showFavoritesOnly) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedYear && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Year: {selectedYear}
                <button
                  onClick={() => onYearChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  aria-label={`Remove year ${selectedYear} filter`}
                >
                  ×
                </button>
              </span>
            )}
            {showSuccessfulOnly && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Successful only
                <button
                  onClick={() => onSuccessfulOnlyChange(false)}
                  className="ml-1 text-green-600 hover:text-green-800"
                  aria-label="Remove successful only filter"
                >
                  ×
                </button>
              </span>
            )}
            {showFavoritesOnly && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Favorites only
                <button
                  onClick={() => onFavoritesOnlyChange(false)}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                  aria-label="Remove favorites only filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
