import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../src/context/FavoritesContext';

// Test component to access favorites context
const TestComponent = () => {
  const { favorites, toggleFavorite, isFavorite, getFavoritesCount } = useFavorites();

  return (
    <div>
      <div data-testid="favorites-count">{getFavoritesCount()}</div>
      <div data-testid="favorites-list">{JSON.stringify(favorites)}</div>
      <button 
        onClick={() => toggleFavorite('test-id-1')}
        data-testid="toggle-favorite-1"
      >
        Toggle Favorite 1
      </button>
      <button 
        onClick={() => toggleFavorite('test-id-2')}
        data-testid="toggle-favorite-2"
      >
        Toggle Favorite 2
      </button>
      <div data-testid="is-favorite-1">{isFavorite('test-id-1') ? 'true' : 'false'}</div>
      <div data-testid="is-favorite-2">{isFavorite('test-id-2') ? 'true' : 'false'}</div>
    </div>
  );
};

describe('Favorites Context', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks
    localStorage.clear();
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  test('initializes with empty favorites', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('[]');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('false');
  });

  test('loads favorites from localStorage on initialization', () => {
    const savedFavorites = ['test-id-1', 'test-id-3'];
    localStorage.getItem.mockReturnValue(JSON.stringify(savedFavorites));

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent(JSON.stringify(savedFavorites));
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('false');
  });

  test('adds favorite when toggleFavorite is called on non-favorite item', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Initially not favorited
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');

    // Toggle favorite
    fireEvent.click(screen.getByTestId('toggle-favorite-1'));

    // Should now be favorited
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('["test-id-1"]');

    // Should save to localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'spacex_favorites',
      JSON.stringify(['test-id-1'])
    );
  });

  test('removes favorite when toggleFavorite is called on favorite item', () => {
    // Start with some favorites
    localStorage.getItem.mockReturnValue(JSON.stringify(['test-id-1', 'test-id-2']));

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Initially favorited
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');

    // Toggle favorite off
    fireEvent.click(screen.getByTestId('toggle-favorite-1'));

    // Should no longer be favorited
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('["test-id-2"]');

    // Should update localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'spacex_favorites',
      JSON.stringify(['test-id-2'])
    );
  });

  test('handles multiple favorites correctly', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Add multiple favorites
    fireEvent.click(screen.getByTestId('toggle-favorite-1'));
    fireEvent.click(screen.getByTestId('toggle-favorite-2'));

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('true');

    const expectedFavorites = ['test-id-1', 'test-id-2'];
    expect(screen.getByTestId('favorites-list')).toHaveTextContent(JSON.stringify(expectedFavorites));
  });

  test('handles localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    localStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Should not crash the component
    expect(() => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
    }).not.toThrow();

    // Should still work normally
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  test('handles corrupted localStorage data gracefully', () => {
    // Mock localStorage to return invalid JSON
    localStorage.getItem.mockReturnValue('invalid json');

    // Should not crash the component
    expect(() => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
    }).not.toThrow();

    // Should initialize with empty favorites
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });
});
