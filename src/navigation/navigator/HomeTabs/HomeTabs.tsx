import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../../../screens/HomePage/HomePage';
import { MyTabBar } from '../MyTabBar/MyTabBar';
import { ProductDetails } from '../../../screens/ProductDetails/ProductDetails';

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
    return (
        <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
            <Tab.Screen name="Home" component={HomePage} options={{ headerShown: false }} />

            <Tab.Screen name="Products" component={HomePage} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={HomePage} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={HomePage} options={{ headerShown: false }} />
            <Tab.Screen
                name="productDetails"
                component={ProductDetails}
                options={{
                    headerShown: false,
                }}
            />

        </Tab.Navigator>
    );
};
