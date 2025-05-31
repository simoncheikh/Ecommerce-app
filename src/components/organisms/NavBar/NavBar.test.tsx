import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavBar } from './NavBar';
import { useThemeStore } from '../../../store/themeStore/ThemeStore';
import { useSearchStore } from '../../../store/searchStore/searchStore';

jest.mock('../../../store/themeStore/ThemeStore', () => ({
    useThemeStore: jest.fn(),
}));

jest.mock('../../../store/searchStore/searchStore', () => ({
    useSearchStore: jest.fn(),
}));



const mockedUseThemeStore = useThemeStore as jest.Mock;
const mockedUseSearchStore = useSearchStore as jest.Mock;

describe('NavBar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly in light theme and shows logo', () => {
        mockedUseThemeStore.mockReturnValue('light');
        mockedUseSearchStore.mockReturnValue({
            query: '',
            setQuery: jest.fn(),
        });

        const { getByTestId, getByPlaceholderText } = render(<NavBar />);

        const logoImage = getByTestId('logo-image');
        expect(logoImage).toBeTruthy();

        const input = getByPlaceholderText('Search...');
        expect(input.props.value).toBe('');
    });

    it('renders correctly in dark theme', () => {
        mockedUseThemeStore.mockReturnValue('dark');
        mockedUseSearchStore.mockReturnValue({
            query: '',
            setQuery: jest.fn(),
        });

        const { getByPlaceholderText } = render(<NavBar />);
        const input = getByPlaceholderText('Search...');
        expect(input).toBeTruthy();
    });

    it('calls setQuery when typing in SearchField', () => {
        const setQuery = jest.fn();
        mockedUseThemeStore.mockReturnValue('light');
        mockedUseSearchStore.mockReturnValue({
            query: '',
            setQuery,
        });

        const { getByPlaceholderText } = render(<NavBar />);

        const input = getByPlaceholderText('Search...');
        fireEvent.changeText(input, 'test input');

        expect(setQuery).toHaveBeenCalledWith('test input');
    });
});
