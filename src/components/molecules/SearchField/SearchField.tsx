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

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/search.png')} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {value?.length > 0 && (
        <Pressable onPress={onClear} style={styles.clearButton}>
          <Image
            source={require('../../../assets/close.png')} 
            style={styles.clearIcon}
          />
        </Pressable>
      )}
    </View>
  );
};
