import { View, Switch, TouchableOpacity, Pressable, Image } from "react-native";
import { styles } from "./NavBar.styles";
import { SearchField } from "../../molecules/SearchField/SearchField";
import { useThemeContext } from "../../../store/themeContext/ThemeContext";
import { useState } from "react";
import { useAuthStore } from "../../../store/sessionStore/AuthStore";

export const NavBar = () => {
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
      <View style={styles.searchFieldContainer}>
        <SearchField
          value={""}
          onChangeText={() => { }}
        />
      </View>
      <Switch
        onValueChange={handleToggle}
        value={value}
        style={styles.switch}
      />
      <TouchableOpacity onPress={logout}>
        <Image source={require('../../../assets/logout.png')} />
      </TouchableOpacity>
    </View>
  );
};
