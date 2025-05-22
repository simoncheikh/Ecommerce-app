import { View, Switch, TouchableOpacity, Pressable, Image } from "react-native";
import { styles } from "./NavBar.styles";
import { SearchField } from "../../molecules/SearchField/SearchField";
import { useThemeContext } from "../../../store/themeContext/ThemeContext";
import { useState } from "react";
import { useAuthStore } from "../../../store/sessionStore/AuthStore";
import { useSearchStore } from "../../../store/searchStore/searchStore";

export const NavBar = ({ }) => {
  const { query, setQuery } = useSearchStore();
  const { logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeContext();
  const isDarkMode = theme === "dark";
  const [value, setValue] = useState(isDarkMode);

  const handleToggle = () => {
    setValue((prev) => !prev);
    toggleTheme();
  };

  return (
    <View style={styles.container}>
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
      {/* <Switch
        onValueChange={handleToggle}
        value={value}
        style={styles.switch}
      />
      <TouchableOpacity onPress={logout}>
        <Image source={require('../../../assets/logout.png')} />
      </TouchableOpacity> */}
    </View>
  );
};
