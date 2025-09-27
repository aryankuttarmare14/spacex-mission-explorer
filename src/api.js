/**
 * SpaceX API service
 * Fetches launches and rockets data from SpaceX API v4
 */

const SPACEX_API_BASE = 'https://api.spacexdata.com/v4';

/**
 * Fetch all launches from SpaceX API
 * @returns {Promise<Array>} Array of launch objects
 */
export const fetchLaunches = async () => {
  try {
    const response = await fetch(`${SPACEX_API_BASE}/launches`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const launches = await response.json();
    return launches;
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw new Error('Failed to fetch launches. Please try again later.');
  }
};

/**
 * Fetch all rockets from SpaceX API
 * @returns {Promise<Array>} Array of rocket objects
 */
export const fetchRockets = async () => {
  try {
    const response = await fetch(`${SPACEX_API_BASE}/rockets`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rockets = await response.json();
    return rockets;
  } catch (error) {
    console.error('Error fetching rockets:', error);
    throw new Error('Failed to fetch rockets. Please try again later.');
  }
};

/**
 * Fetch launches and rockets data in parallel
 * @returns {Promise<{launches: Array, rockets: Array}>} Object containing launches and rockets
 */
export const fetchLaunchesAndRockets = async () => {
  try {
    const [launches, rockets] = await Promise.all([
      fetchLaunches(),
      fetchRockets()
    ]);
    
    return { launches, rockets };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

/**
 * Enrich launches with rocket names
 * @param {Array} launches - Array of launch objects
 * @param {Array} rockets - Array of rocket objects
 * @returns {Array} Enriched launches with rocket names
 */
export const enrichLaunchesWithRockets = (launches, rockets) => {
  const rocketMap = new Map(rockets.map(rocket => [rocket.id, rocket]));
  
  return launches.map(launch => ({
    ...launch,
    rocketName: rocketMap.get(launch.rocket)?.name || 'Unknown Rocket',
    rocketType: rocketMap.get(launch.rocket)?.type || 'Unknown'
  }));
};

/**
 * Format launch date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatLaunchDate = (dateString) => {
  if (!dateString) return 'TBD';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

/**
 * Get launch status badge class
 * @param {boolean} success - Launch success status
 * @param {boolean} upcoming - Whether launch is upcoming
 * @returns {string} CSS class for status badge
 */
export const getLaunchStatusBadge = (success, upcoming) => {
  if (upcoming) return 'badge-upcoming';
  if (success === true) return 'badge-success';
  if (success === false) return 'badge-failure';
  return 'badge-upcoming';
};

/**
 * Get launch status text
 * @param {boolean} success - Launch success status
 * @param {boolean} upcoming - Whether launch is upcoming
 * @returns {string} Status text
 */
export const getLaunchStatusText = (success, upcoming) => {
  if (upcoming) return 'Upcoming';
  if (success === true) return 'Success';
  if (success === false) return 'Failed';
  return 'Unknown';
};
