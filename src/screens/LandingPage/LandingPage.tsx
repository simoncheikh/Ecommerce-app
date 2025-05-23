import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from './LandingPage.styles';
import { View, Image, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { GlobalStyles } from "../../styles/GobalStyles";

export const LandingPage = ({ navigation }: any) => {
  const theme = useThemeStore((state) => state.theme)

  const spinValue = new Animated.Value(0);

  const isDarkMode = theme == 'dark'

  const darkTheme = GlobalStyles.theme.darkTheme
  const lightTheme = GlobalStyles.theme.lightTheme

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  useEffect(() => {
    Animated.loop(
      Animated.timing(
        spinValue,
        {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        }
      )
    ).start();

    const timer = setTimeout(() => {
      // navigation.navigate('SignIn');
    }, 2000);

    return () => {
      clearTimeout(timer);
      spinValue.stopAnimation();
    };
  }, [navigation, spinValue]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
      <View style={styles.centerContainer}>
        <Animated.Image
          source={require('../../assets/store.png')}
          style={[styles.image, { transform: [{ rotate: spin }] }]}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};