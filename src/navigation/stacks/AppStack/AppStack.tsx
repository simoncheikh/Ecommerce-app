import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeTabs } from "../../navigator/HomeTabs/HomeTabs";
import { ProductDetails } from "../../../screens/ProductDetails/ProductDetails";

const Stack = createNativeStackNavigator();

export const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
    </Stack.Navigator>
);
