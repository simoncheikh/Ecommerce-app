import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../../../screens/HomePage/HomePage';
import { MyTabBar } from '../MyTabBar/MyTabBar';
import { ProductDetails } from '../../../screens/ProductDetails/ProductDetails';
import { ProfilePage } from '../../../screens/ProfilePage/ProfilePage';
import { EditProfile } from '../../../screens/EditProfile/EditProfile';
import { AddProduct } from '../../../screens/AddProduct/AddProduct';
import { GlobalStyles } from '../../../styles/GobalStyles';
import { EditProduct } from '../../../screens/EditProduct/EditProduct';
import { SettingsPage } from '../../../screens/SettingsPage/SettingsPage';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../../store/sessionStore/AuthStore';
import { useCameraStore } from '../../../store/cameraStore/CameraStore';
import { useThemeStore } from '../../../store/themeStore/ThemeStore';
import { ShopCart } from '../../../screens/ShopCart/ShopCart';

const Tab = createBottomTabNavigator();

export const HomeTabs: React.FC = () => {
    const { logout } = useAuthStore();
    const theme = useThemeStore((state) => state.theme);
    const isDark = theme === 'dark';
    const isCameraOpen = useCameraStore((state) => state.isCameraOpen);
    const backgroundColor = isDark
        ? GlobalStyles.theme.darkTheme.backgroundColor
        : GlobalStyles.theme.lightTheme.backgroundColor;

    return (
        <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />} initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={HomePage}
                options={{
                    headerShown: false,
                    tabBarIcon: require('../../../assets/home.png'),
                }}
                
            />
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    headerShown: false,
                    tabBarIcon: require('../../../assets/profile.png'),
                }}
            />
            <Tab.Screen
                name="My Cart"
                component={ShopCart}
                options={{
                    headerShown: true,
                    tabBarIcon: require('../../../assets//cart.png'),
                    headerTitle: 'My Cart',
                    // headerStyle: { backgroundColor },
                    // headerTitleStyle: {
                    //     color: GlobalStyles.color.primary,
                    //     fontFamily: GlobalStyles.fonts.regular.title,
                    // },
                    // headerBackTitleStyle: {
                    //     fontFamily: GlobalStyles.fonts.regular.title,
                    // },
                }}

            />
            <Tab.Screen
                name="Settings"
                component={SettingsPage}
                options={{
                    headerShown: true,
                    tabBarIcon: require('../../../assets/settings.png'),
                    headerTitle: 'Settings',
                    headerStyle: { backgroundColor },
                    headerTitleStyle: {
                        color: GlobalStyles.color.primary,
                        fontFamily: GlobalStyles.fonts.regular.title,
                    },
                    headerBackTitleStyle: {
                        fontFamily: GlobalStyles.fonts.regular.title,
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                            <Image
                                source={require('../../../assets/logout.png')}
                                style={{ width: 24, height: 24, tintColor: '#ff3b30' }}
                            />
                        </TouchableOpacity>
                    ),
                }}

            />
            <Tab.Screen
                name="ProductDetails"
                component={ProductDetails}
                options={{ headerShown: false}}
            />
            <Tab.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    headerShown: !isCameraOpen,
                    headerTransparent: true,
                    headerTitle: '',
                    headerShadowVisible: false,
                }}
            />
            <Tab.Screen
                name="AddProduct"
                component={AddProduct}
                options={{
                    headerShown: !isCameraOpen,
                    headerTitle: 'Add Product',
                    headerShadowVisible: false,
                    headerTitleStyle: { color: GlobalStyles.color.primary },
                    headerBackTitleStyle: { fontFamily: GlobalStyles.fonts.regular.title },
                }}
            />
            <Tab.Screen
                name="EditProduct"
                component={EditProduct}
                options={{
                    headerShown: !isCameraOpen,
                    headerTitle: 'Edit Product',
                    headerShadowVisible: false,
                    headerTitleStyle: { color: GlobalStyles.color.primary },
                    headerBackTitleStyle: { fontFamily: GlobalStyles.fonts.regular.title },
                }}
            />
        </Tab.Navigator>
    );
};
