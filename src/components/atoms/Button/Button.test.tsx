import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button'

describe('Button component', () => {
  it('renders the correct label', () => {
    const { getByText } = render(
      <Button label="Click Me" onClick={() => {}} variant="primary" />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onClick when pressed', () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <Button label="Press" onClick={onClickMock} variant="primary" />
    );
    fireEvent.press(getByText('Press'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('does not call onClick when disabled', () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <Button 
        label="Disabled" 
        onClick={onClickMock} 
        disabled={true} 
        variant="primary" 
      />
    );
    fireEvent.press(getByText('Disabled'));
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('applies correct background color for primary variant', () => {
    const { getByTestId } = render(
      <Button label="Primary" onClick={() => {}} variant="primary" />
    );
    expect(getByTestId('button')).toHaveStyle({ backgroundColor: '#e99e5b' });
  });

  it('applies correct background color when disabled', () => {
    const { getByTestId } = render(
      <Button 
        label="Disabled" 
        onClick={() => {}} 
        variant="primary" 
        disabled={true} 
      />
    );
    expect(getByTestId('button')).toHaveStyle({ backgroundColor: 'gray' });
  });

  it('applies correct text color for primary variant', () => {
    const { getByText } = render(
      <Button label="Primary" onClick={() => {}} variant="primary" />
    );
    expect(getByText('Primary')).toHaveStyle({ color: 'white' });
  });

  it('applies correct text color for secondary variant', () => {
    const { getByText } = render(
      <Button label="Secondary" onClick={() => {}} variant="secondary" />
    );
    expect(getByText('Secondary')).toHaveStyle({ color: '#e99e5b' });
  });
});