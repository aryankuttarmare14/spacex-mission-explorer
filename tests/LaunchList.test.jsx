import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import LaunchList from '../src/components/LaunchList';

// Mock data
const mockLaunches = [
  {
    id: '1',
    name: 'Test Mission 1',
    date_utc: '2023-01-01T00:00:00.000Z',
    success: true,
    upcoming: false,
    rocketName: 'Falcon 9',
    flight_number: 1,
    links: {
      patch: {
        small: 'https://example.com/patch1.png'
      }
    }
  },
  {
    id: '2',
    name: 'Test Mission 2',
    date_utc: '2023-02-01T00:00:00.000Z',
    success: false,
    upcoming: false,
    rocketName: 'Falcon Heavy',
    flight_number: 2,
    links: {
      patch: {
        small: 'https://example.com/patch2.png'
      }
    }
  },
  {
    id: '3',
    name: 'Upcoming Mission',
    date_utc: '2024-01-01T00:00:00.000Z',
    success: null,
    upcoming: true,
    rocketName: 'Starship',
    flight_number: 3,
    links: {
      patch: {
        small: 'https://example.com/patch3.png'
      }
    }
  }
];

// Helper function to render with providers
const renderWithProviders = (component) => {
  return render(
    <FavoritesProvider>
      {component}
    </FavoritesProvider>
  );
};

describe('LaunchList', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  test('renders launch cards correctly', () => {
    renderWithProviders(
      <LaunchList 
        launches={mockLaunches} 
        showFavoritesOnly={false}
        onLaunchSelect={jest.fn()}
      />
    );

    // Check if all launches are rendered
    expect(screen.getByText('Test Mission 1')).toBeInTheDocument();
    expect(screen.getByText('Test Mission 2')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Mission')).toBeInTheDocument();

    // Check rocket names
    expect(screen.getByText('Falcon 9')).toBeInTheDocument();
    expect(screen.getByText('Falcon Heavy')).toBeInTheDocument();
    expect(screen.getByText('Starship')).toBeInTheDocument();

    // Check results summary
    expect(screen.getByText('Showing 3 of 3 launches')).toBeInTheDocument();
  });

  test('filters launches by favorites when showFavoritesOnly is true', () => {
    // Mock localStorage to return some favorites
    localStorage.getItem.mockReturnValue(JSON.stringify(['1', '3']));

    renderWithProviders(
      <LaunchList 
        launches={mockLaunches} 
        showFavoritesOnly={true}
        onLaunchSelect={jest.fn()}
      />
    );

    // Only favorited launches should be visible
    expect(screen.getByText('Test Mission 1')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Mission')).toBeInTheDocument();
    expect(screen.queryByText('Test Mission 2')).not.toBeInTheDocument();

    // Check results summary
    expect(screen.getByText('Showing 2 of 3 launches')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  test('shows empty state when no launches match filters', () => {
    renderWithProviders(
      <LaunchList 
        launches={[]} 
        showFavoritesOnly={false}
        onLaunchSelect={jest.fn()}
      />
    );

    expect(screen.getByText('No Launches Found')).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your search criteria/)).toBeInTheDocument();
  });

  test('shows empty favorites state when no favorites exist', () => {
    renderWithProviders(
      <LaunchList 
        launches={mockLaunches} 
        showFavoritesOnly={true}
        onLaunchSelect={jest.fn()}
      />
    );

    expect(screen.getByText('No Favorite Launches')).toBeInTheDocument();
    expect(screen.getByText(/You haven't marked any launches as favorites yet/)).toBeInTheDocument();
  });

  test('calls onLaunchSelect when launch card is clicked', () => {
    const mockOnLaunchSelect = jest.fn();
    
    renderWithProviders(
      <LaunchList 
        launches={mockLaunches} 
        showFavoritesOnly={false}
        onLaunchSelect={mockOnLaunchSelect}
      />
    );

    // Click on first launch card
    fireEvent.click(screen.getByText('Test Mission 1'));
    
    expect(mockOnLaunchSelect).toHaveBeenCalledWith(mockLaunches[0]);
  });

  test('calls onLaunchSelect when launch card is activated with keyboard', () => {
    const mockOnLaunchSelect = jest.fn();
    
    renderWithProviders(
      <LaunchList 
        launches={mockLaunches} 
        showFavoritesOnly={false}
        onLaunchSelect={mockOnLaunchSelect}
      />
    );

    // Focus and activate first launch card with Enter
    const firstCard = screen.getByText('Test Mission 1').closest('[role="button"]');
    firstCard.focus();
    fireEvent.keyDown(firstCard, { key: 'Enter' });
    
    expect(mockOnLaunchSelect).toHaveBeenCalledWith(mockLaunches[0]);
  });
});
