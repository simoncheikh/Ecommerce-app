import React from 'react';
import { View, Platform, Image } from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { GlobalStyles } from '../../../styles/GobalStyles';
import { useCameraStore } from '../../../store/cameraStore/CameraStore';
import { useThemeStore } from '../../../store/themeStore/ThemeStore';

export const MyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const isCameraOpen = useCameraStore((state) => state.isCameraOpen)
  const theme = useThemeStore((state) => state.theme);
  const { colors } = useTheme();
  const isDark = theme === "dark";
  const darkTheme = GlobalStyles.theme.darkTheme
  const lightTheme = GlobalStyles.theme.lightTheme
  const { buildHref } = useLinkBuilder();
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        if (route.name === 'ProductDetails' || route.name == "EditProduct" || route.name == 'EditProfile' || route.name == 'AddProduct') {
          return null;
        }
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, display: isCameraOpen && "none", alignItems: 'center', justifyContent: "center", padding: "2%", backgroundColor: isDark ? darkTheme.backgroundColor : lightTheme.backgroundColor }}
          >
            {options.tabBarIcon && (
              <Image
                source={options.tabBarIcon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: isFocused ? GlobalStyles.color.primary : "gray",
                  marginBottom: 4,
                }}
              />
            )}

            <Text
              style={{
                color: isFocused
                  ? GlobalStyles.color.primary
                  : isDark
                    ? GlobalStyles.theme.darkTheme.color
                    : GlobalStyles.theme.lightTheme.color,
              }}
            >
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};
