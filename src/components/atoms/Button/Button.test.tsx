import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label correctly', () => {
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
      <Button label="Disabled" onClick={onClickMock} variant="primary" disabled />
    );
    fireEvent.press(getByText('Disabled'));
    expect(onClickMock).not.toHaveBeenCalled();
  });

});
it('applies the correct background color for primary variant', () => {
  const { getByTestId } = render(
    <Button label="Primary" onClick={() => {}} variant="primary" />
  );
  expect(getByTestId('button').props.style.backgroundColor).toBe('#e99e5b');
});

it('applies gray background color when disabled', () => {
  const { getByTestId } = render(
    <Button label="Disabled" onClick={() => {}} variant="primary" disabled />
  );
  expect(getByTestId('button').props.style.backgroundColor).toBe('gray');
});

