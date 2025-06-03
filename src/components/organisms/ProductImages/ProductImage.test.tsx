import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductImage } from './ProductImage';

jest.mock('../../../utils/SaveImageToGallery', () => ({
  saveImageToGallery: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  
  Reanimated.useSharedValue = jest.fn(initial => ({ value: initial }));
  Reanimated.useAnimatedStyle = jest.fn(cb => cb());
  Reanimated.withTiming = jest.fn((value, config, callback) => {
    if (callback) callback();
    return value;
  });
  
  return Reanimated;
});

describe('ProductImage', () => {
  const API_BASE_URL = 'https://backend-practice.eurisko.me';
  const testUrl = '/images/product.png';

  it('renders image with correct source uri', () => {
    const { getByTestId } = render(<ProductImage url={testUrl} />);
    const image = getByTestId('product-image');
    expect(image.props.source.uri).toBe(`${API_BASE_URL}${testUrl}`);
  });

  it('calls saveImageToGallery on long press', () => {
    const { getByTestId } = render(<ProductImage url={testUrl} />);
    const pressable = getByTestId('pressable-container');
    
    fireEvent(pressable, 'onLongPress');
    
    const { saveImageToGallery } = require('../../../utils/SaveImageToGallery');
    expect(saveImageToGallery).toHaveBeenCalledWith(`${API_BASE_URL}${testUrl}`);
  });
});