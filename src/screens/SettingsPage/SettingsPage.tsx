import { View, Switch, Text } from 'react-native';
import { styles } from './SettingsPage.style';
import { useState } from 'react';
import { useThemeStore } from '../../store/themeStore/ThemeStore';
import { GlobalStyles } from '../../styles/GobalStyles';
import { useAuthStore } from '../../store/sessionStore/AuthStore';
import { SafeAreaView } from "react-native-safe-area-context";


export const SettingsPage = () => {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const token = useAuthStore((state) => state.token);

    const isDarkMode = theme === "dark";
    const [value, setValue] = useState(isDarkMode);
    const isLoggedIn = !!token;


    const darkTheme = GlobalStyles.theme.darkTheme
    const lightTheme = GlobalStyles.theme.lightTheme

    const handleToggle = () => {
        setValue(prev => !prev);
        toggleTheme();
    };

    if (!isLoggedIn || !token?.data?.accessToken) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view products.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
            <View style={styles.header}>
                <View style={[styles.switchWrapper, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
                    <Text style={[styles.switchLabelText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                        Dark Mode
                    </Text>
                    <View style={styles.switchContainer}>
                        <Switch
                            onValueChange={handleToggle}
                            value={value}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
                        />
                        <Text style={[styles.onOffText, { color: isDarkMode ? '#ddd' : '#444' }]}>
                            {isDarkMode ? 'ON' : 'OFF'}
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};
