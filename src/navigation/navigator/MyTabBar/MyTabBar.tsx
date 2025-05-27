import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  withTiming
} from 'react-native-reanimated';
import { GlobalStyles } from '../../../styles/GobalStyles';
import { useThemeStore } from '../../../store/themeStore/ThemeStore';
import { useCameraStore } from '../../../store/cameraStore/CameraStore';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TabButton: React.FC<{
  isFocused: boolean;
  onPress: () => void;
  icon: any;
  label: string;
  isDark: boolean;
}> = ({ isFocused, onPress, icon, label, isDark }) => {
  const animation = useSharedValue(0);

  React.useEffect(() => {
    animation.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animation.value, [0, 1], [0, -10]);
    const scale = interpolate(animation.value, [0, 1], [1, 1.2]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 1], [0.6, 1]);
    return {
      opacity,
    };
  });

  return (
    <AnimatedTouchable
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.tabButton, animatedStyle]}
    >
      <Animated.View style={styles.iconContainer}>
        <Animated.Image
          source={icon}
          style={[
            styles.icon,
            {
              tintColor: isFocused
                ? GlobalStyles.color.primary
                : isDark
                  ? '#fff'
                  : '#000'
            }
          ]}
        />
      </Animated.View>
      <Animated.Text
        style={[
          styles.label,
          textStyle,
          {
            color: isFocused
              ? GlobalStyles.color.primary
              : isDark
                ? '#fff'
                : '#000'
          }
        ]}
      >
        {label}
      </Animated.Text>
    </AnimatedTouchable >
  );
};

export const MyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useThemeStore((state) => state.theme);
  const isCameraOpen = useCameraStore((state) => state.isCameraOpen)

  const isDark = theme === 'dark';

  if (isCameraOpen) return null;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark
          ? GlobalStyles.theme.darkTheme.backgroundColor
          : GlobalStyles.theme.lightTheme.backgroundColor,
        borderTopColor: isDark ? '#333' : '#eee',
      }
    ]}>
      {state.routes.map((route, index) => {
        if (
          ['ProductDetails', 'EditProduct', 'EditProfile', 'AddProduct'].includes(route.name)
        ) {
          return null;
        }
        const { options } = descriptors[route.key];
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



        return (
          <TabButton
            key={route.key}
            isFocused={isFocused}
            onPress={onPress}
            icon={options.tabBarIcon}
            label={options.tabBarLabel || route.name}
            isDark={isDark}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    borderTopWidth: 1,
    paddingBottom: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});