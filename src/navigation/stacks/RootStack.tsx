import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUp } from '../../screens/SignUp/SignUp';
import { LandingPage } from '../../screens/LandingPage/LandingPage';
import { SignIn } from '../../screens/SignIn/SignIn';

const Stack = createNativeStackNavigator();

export const RootStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LandingPage"
                component={LandingPage}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
        </Stack.Navigator>
    );
};