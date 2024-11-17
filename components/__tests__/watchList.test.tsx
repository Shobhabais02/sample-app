import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import WatchList from '../../app/screens/watchList';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('WatchList Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        movies: {
          watchlist: [
            { id: 1, title: 'Movie 1', poster_path: '/path1.jpg', release_date: '2023-01-01' },
          ],
        },
      })
    );
  });

  it('renders the watchlist correctly', () => {
    const { getByText } = render(<WatchList />);

    expect(getByText('Movie 1')).toBeTruthy();
    expect(getByText('Release Date: 2023-01-01')).toBeTruthy();
  });

  it('dispatches the correct action on delete', () => {
    const { getByText } = render(<WatchList />);

    const deleteButton = getByText('🗑️');
    fireEvent.press(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'movies/removeFromWatchlist',
      payload: 1,
    });
  });
});
