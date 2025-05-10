import { View, Switch, TouchableOpacity, Pressable, Image } from "react-native";
import { styles } from "./NavBar.styles";
import { SearchField } from "../../molecules/SearchField/SearchField";
import { useThemeContext } from "../../../store/themeContext/ThemeContext";
import { useState } from "react";
import { useAuth } from "../../../store/AuthContext/AuthContext";

export const NavBar = () => {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useThemeContext();
  const isDarkMode = theme === "dark";
  const [value, setValue] = useState(isDarkMode);

  const handleToggle = () => {
    setValue((prev) => !prev);
    toggleTheme();
  };

  const handleLogout = () => {
    logout()
  }

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
      <TouchableOpacity onPress={() => handleLogout()}>
        <Image source={require('../../../assets/logout.png')} />
      </TouchableOpacity>
    </View>
  );
};
