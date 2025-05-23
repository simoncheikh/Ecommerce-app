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

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
    const { logout } = useAuthStore()
    const isCameraOpen = useCameraStore((state) => state.isCameraOpen)

    return (
        <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={HomePage} options={{ headerShown: false, tabBarIcon: require("../../../assets/home.png") }} />
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    headerShown: false,
                    tabBarIcon: require("../../../assets/profile.png"),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsPage}
                options={{
                    headerShown: true,
                    tabBarIcon: require("../../../assets/settings.png"),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Settings</Text>
                        </View>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={logout}
                            style={{ marginRight: 15 }}
                        >
                            <Image
                                source={require("../../../assets/logout.png")}
                                style={{ width: 24, height: 24, tintColor: '#ff3b30' }}
                            />
                        </TouchableOpacity>
                    )
                }}
            />

            <Tab.Screen
                name="ProductDetails"
                component={ProductDetails}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: '',
                    headerShadowVisible: false,
                }}
            />
            <Tab.Screen
                name="AddProduct"
                component={AddProduct}
                options={{
                    headerShown: isCameraOpen == true ? false : true,
                    headerTitle: 'Add Product',
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        color: GlobalStyles.color.primary
                    },
                    headerBackTitleStyle: {
                        fontFamily: GlobalStyles.fonts.regular.title,

                    },
                }}
            />
            <Tab.Screen
                name="EditProduct"
                component={EditProduct}
                options={{
                    headerShown: isCameraOpen == true ? false : true,
                    headerTitle: 'Edit Product',
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        color: GlobalStyles.color.primary
                    },
                    headerBackTitleStyle: {
                        fontFamily: GlobalStyles.fonts.regular.title,

                    }
                }}
            />

        </Tab.Navigator>
    );
};
