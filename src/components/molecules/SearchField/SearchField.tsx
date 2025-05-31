import React from 'react';
import { styles } from './SearchField.styles';
import {
  View,
  TextInput,
  TextInputProps,
  Pressable,
  Image
} from 'react-native';
import { SearchFieldProps } from './SearchField.type';
import { useThemeStore } from '../../../store/themeStore/ThemeStore';
import { GlobalStyles } from '../../../styles/GobalStyles';

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  ...props
}) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const darkTheme = GlobalStyles.theme.darkTheme
  const lightTheme = GlobalStyles.theme.lightTheme
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? darkTheme.backgroundColor
            : lightTheme.backgroundColor,
        },
      ]}
    >
      <Image
        source={require('../../../assets/search.png')}
        style={[styles.icon, { tintColor: isDark ? darkTheme.color : lightTheme.color }]}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: isDark
              ? darkTheme.color
              : lightTheme.color,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? darkTheme.color : lightTheme.color}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {value?.length > 0 && (
        <Pressable onPress={onClear} style={styles.clearButton} testID='clear-button'>
          <Image
            source={require('../../../assets/close.png')}
            style={[styles.clearIcon, { tintColor: isDark ? '#fff' : '#000' }]}
          />
        </Pressable>
      )}
    </View>
  );
};
