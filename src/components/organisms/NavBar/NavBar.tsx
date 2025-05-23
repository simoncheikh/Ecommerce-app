import { View, Switch, TouchableOpacity, Pressable, Image } from "react-native";
import { styles } from "./NavBar.styles";
import { SearchField } from "../../molecules/SearchField/SearchField";
import { useThemeStore } from "../../../store/themeStore/ThemeStore";
import { useState } from "react";
import { useAuthStore } from "../../../store/sessionStore/AuthStore";
import { useSearchStore } from "../../../store/searchStore/searchStore";
import { GlobalStyles } from "../../../styles/GobalStyles";

export const NavBar = ({ }) => {
  const { query, setQuery } = useSearchStore();
  const theme = useThemeStore((state) => state.theme)


  const isDarkMode = theme == 'dark'


  const darkTheme = GlobalStyles.theme.darkTheme
  const lightTheme = GlobalStyles.theme.lightTheme


  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
      <View style={styles.row}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.searchFieldWrapper}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
          />
        </View>
      </View>
    </View>
  );
};
