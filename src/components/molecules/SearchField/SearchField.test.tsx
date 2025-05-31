import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchField } from './SearchField';
import { useThemeStore } from '../../../store/themeStore/ThemeStore';

jest.mock('../../../store/themeStore/ThemeStore', () => ({
    useThemeStore: jest.fn(),
}));


const mockedUseThemeStore = useThemeStore as jest.Mock;

describe('SearchField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with light theme', () => {
        mockedUseThemeStore.mockReturnValue('light');

        const onChangeText = jest.fn();
        const onClear = jest.fn();

        const { getByPlaceholderText } = render(
            <SearchField
                value=""
                onChangeText={onChangeText}
                onClear={onClear}
                placeholder="Search here"
            />
        );

        const input = getByPlaceholderText('Search here');
        expect(input.props.value).toBe('');
    });

    it('renders correctly with dark theme', () => {
        mockedUseThemeStore.mockReturnValue('dark');

        const onChangeText = jest.fn();
        const onClear = jest.fn();

        const { getByPlaceholderText } = render(
            <SearchField
                value=""
                onChangeText={onChangeText}
                onClear={onClear}
                placeholder="Search here"
            />
        );

        const input = getByPlaceholderText('Search here');
        expect(input.props.value).toBe('');
    });

    it('calls onChangeText when typing', () => {
        mockedUseThemeStore.mockReturnValue('light');

        const onChangeText = jest.fn();

        const { getByPlaceholderText } = render(
            <SearchField value="" onChangeText={onChangeText} onClear={jest.fn()} />
        );

        const input = getByPlaceholderText('Search...');
        fireEvent.changeText(input, 'test input');

        expect(onChangeText).toHaveBeenCalledWith('test input');
    });

    it('shows clear button and calls onClear when pressed', () => {
        mockedUseThemeStore.mockReturnValue('light');

        const onClear = jest.fn();

        const { getByTestId } = render(
            <SearchField value="something" onChangeText={jest.fn()} onClear={onClear} />
        );

        const clearButton = getByTestId('clear-button');
        fireEvent.press(clearButton);

        expect(onClear).toHaveBeenCalled();
    });
});
