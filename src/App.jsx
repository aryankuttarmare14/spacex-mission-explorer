import React, { useState, useEffect, useMemo } from 'react';
import { FavoritesProvider } from './context/FavoritesContext';
import { fetchLaunchesAndRockets, enrichLaunchesWithRockets } from './api';
import Header from './components/Header';
import Filters from './components/Filters';
import LaunchList from './components/LaunchList';
import LaunchModal from './components/LaunchModal';

/**
 * Main App component that orchestrates the SpaceX Mission Explorer
 */
function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showSuccessfulOnly, setShowSuccessfulOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { launches: launchesData, rockets } = await fetchLaunchesAndRockets();
        const enrichedLaunches = enrichLaunchesWithRockets(launchesData, rockets);
        
        // Sort launches by date (most recent first)
        const sortedLaunches = enrichedLaunches.sort((a, b) => 
          new Date(b.date_utc || 0) - new Date(a.date_utc || 0)
        );
        
        setLaunches(sortedLaunches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique years for filter dropdown
  const availableYears = useMemo(() => {
    const years = launches
      .map(launch => new Date(launch.date_utc).getFullYear())
      .filter(year => !isNaN(year))
      .sort((a, b) => b - a); // Most recent first
    
    return [...new Set(years)];
  }, [launches]);

  // Filter launches based on current filter states
  const filteredLaunches = useMemo(() => {
    return launches.filter(launch => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const missionName = launch.name?.toLowerCase() || '';
        const rocketName = launch.rocketName?.toLowerCase() || '';
        
        if (!missionName.includes(query) && !rocketName.includes(query)) {
          return false;
        }
      }

      // Year filter
      if (selectedYear) {
        const launchYear = new Date(launch.date_utc).getFullYear();
        if (launchYear !== parseInt(selectedYear)) {
          return false;
        }
      }

      // Success filter
      if (showSuccessfulOnly && launch.success !== true) {
        return false;
      }

      // Favorites filter (will be handled by LaunchList component)
      
      return true;
    });
  }, [launches, searchQuery, selectedYear, showSuccessfulOnly]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleLaunchSelect = (launch) => {
    setSelectedLaunch(launch);
  };

  const handleModalClose = () => {
    setSelectedLaunch(null);
  };

  if (loading) {
    return (
      <FavoritesProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-spacex-blue"></div>
              <p className="mt-4 text-gray-600">Loading SpaceX missions...</p>
            </div>
          </div>
        </div>
      </FavoritesProvider>
    );
  }

  if (error) {
    return (
      <FavoritesProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                <h3 className="font-semibold mb-2">Error Loading Data</h3>
                <p className="text-sm mb-4">{error}</p>
                <button 
                  onClick={handleRetry}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </FavoritesProvider>
    );
  }

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="container mx-auto px-4 py-8">
          <Filters
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            showSuccessfulOnly={showSuccessfulOnly}
            onSuccessfulOnlyChange={setShowSuccessfulOnly}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesOnlyChange={setShowFavoritesOnly}
          />
          
          <LaunchList
            launches={filteredLaunches}
            showFavoritesOnly={showFavoritesOnly}
            onLaunchSelect={handleLaunchSelect}
          />
        </main>

        {selectedLaunch && (
          <LaunchModal
            launch={selectedLaunch}
            onClose={handleModalClose}
          />
        )}
      </div>
    </FavoritesProvider>
  );
}

export default App;
