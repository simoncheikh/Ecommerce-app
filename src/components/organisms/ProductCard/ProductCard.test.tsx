import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from './ProductCard';
import { useThemeStore } from '../../../store/themeStore/ThemeStore';

jest.mock('../../../store/themeStore/ThemeStore', () => ({
  useThemeStore: jest.fn(),
}));

const mockedUseThemeStore = useThemeStore as jest.Mock;

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders skeleton placeholder when loading is true', () => {
    mockedUseThemeStore.mockReturnValue('light');

    const { queryByText } = render(<ProductCard loading={true} cardWidth={200} />);

    expect(queryByText(/./)).toBeNull();
  });

  it('renders product info and handles press when loading is false', () => {
    mockedUseThemeStore.mockReturnValue('light');

    const onPressMock = jest.fn();
    const product = {
      source: { uri: 'https://example.com/image.png' },
      title: 'Test Product',
      price: 99.99,
      cardWidth: 180,
      onPress: onPressMock,
    };

    const { getByText, getByRole } = render(<ProductCard {...product} />);

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();

    fireEvent.press(getByRole('button')); 
    expect(onPressMock).toHaveBeenCalled();
  });
});
