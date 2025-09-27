import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import LaunchModal from '../src/components/LaunchModal';

// Mock launch data
const mockLaunch = {
  id: 'test-launch-1',
  name: 'Test Mission',
  date_utc: '2023-01-01T12:00:00.000Z',
  success: true,
  upcoming: false,
  flight_number: 123,
  rocketName: 'Falcon 9',
  details: 'This is a test mission description that explains what the mission is about.',
  links: {
    patch: {
      large: 'https://example.com/large-patch.png'
    },
    wikipedia: 'https://en.wikipedia.org/wiki/Test_Mission',
    webcast: 'https://youtube.com/watch?v=test',
    article: 'https://spacex.com/news/test-mission',
    flickr: {
      original: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
        'https://example.com/photo3.jpg',
        'https://example.com/photo4.jpg',
        'https://example.com/photo5.jpg'
      ]
    }
  }
};

// Helper function to render with providers
const renderWithProviders = (component) => {
  return render(
    <FavoritesProvider>
      {component}
    </FavoritesProvider>
  );
};

describe('LaunchModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  test('renders modal with launch details', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    // Check modal title
    expect(screen.getByText('Test Mission')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Check launch details
    expect(screen.getByText('Flight Number:')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Rocket:')).toBeInTheDocument();
    expect(screen.getByText('Falcon 9')).toBeInTheDocument();

    // Check mission description
    expect(screen.getByText('Mission Description')).toBeInTheDocument();
    expect(screen.getByText('This is a test mission description that explains what the mission is about.')).toBeInTheDocument();

    // Check status badge
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  test('renders links section with all available links', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    // Check links section
    expect(screen.getByText('Links')).toBeInTheDocument();

    // Check Wikipedia link
    const wikipediaLink = screen.getByText('Wikipedia Article');
    expect(wikipediaLink).toBeInTheDocument();
    expect(wikipediaLink.closest('a')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Test_Mission');
    expect(wikipediaLink.closest('a')).toHaveAttribute('target', '_blank');

    // Check webcast link
    const webcastLink = screen.getByText('Watch Webcast');
    expect(webcastLink).toBeInTheDocument();
    expect(webcastLink.closest('a')).toHaveAttribute('href', 'https://youtube.com/watch?v=test');

    // Check press kit link
    const articleLink = screen.getByText('Press Kit');
    expect(articleLink).toBeInTheDocument();
    expect(articleLink.closest('a')).toHaveAttribute('href', 'https://spacex.com/news/test-mission');
  });

  test('renders mission photos when available', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    // Check mission photos section
    expect(screen.getByText('Mission Photos')).toBeInTheDocument();

    // Should render first 4 photos
    const photos = screen.getAllByAltText(/mission photo/);
    expect(photos).toHaveLength(4);

    // Check that photos have correct src attributes
    expect(photos[0]).toHaveAttribute('src', 'https://example.com/photo1.jpg');
    expect(photos[1]).toHaveAttribute('src', 'https://example.com/photo2.jpg');
  });

  test('calls onClose when close button is clicked', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Escape key is pressed', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when modal content is clicked', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    const modalContent = screen.getByRole('dialog');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('toggles favorite status when favorite button is clicked', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);

    // Should update localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'spacex_favorites',
      JSON.stringify(['test-launch-1'])
    );

    // Button label should change
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  test('shows correct favorite status based on localStorage', () => {
    // Mock localStorage to return this launch as favorited
    localStorage.getItem.mockReturnValue(JSON.stringify(['test-launch-1']));

    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    // Should show as favorited
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  test('handles missing optional fields gracefully', () => {
    const minimalLaunch = {
      id: 'minimal-launch',
      name: 'Minimal Mission',
      date_utc: '2023-01-01T12:00:00.000Z',
      success: null,
      upcoming: true,
      rocketName: 'Test Rocket'
    };

    renderWithProviders(
      <LaunchModal launch={minimalLaunch} onClose={mockOnClose} />
    );

    // Should still render basic information
    expect(screen.getByText('Minimal Mission')).toBeInTheDocument();
    expect(screen.getByText('Test Rocket')).toBeInTheDocument();

    // Should not crash when optional fields are missing
    expect(screen.queryByText('Mission Description')).not.toBeInTheDocument();
    expect(screen.queryByText('Links')).not.toBeInTheDocument();
    expect(screen.queryByText('Mission Photos')).not.toBeInTheDocument();
  });

  test('formats launch date correctly', () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    // Should show formatted date
    expect(screen.getByText(/Jan 1, 2023/)).toBeInTheDocument();
  });

  test('shows correct status badge for different launch states', () => {
    const failedLaunch = { ...mockLaunch, success: false, upcoming: false };
    
    renderWithProviders(
      <LaunchModal launch={failedLaunch} onClose={mockOnClose} />
    );

    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  test('focuses modal on mount', async () => {
    renderWithProviders(
      <LaunchModal launch={mockLaunch} onClose={mockOnClose} />
    );

    const modal = screen.getByRole('dialog');
    
    await waitFor(() => {
      expect(modal).toHaveFocus();
    });
  });
});
