import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "../../../screens/SignIn/SignIn";
import { SignUp } from "../../../screens/SignUp/SignUp";
import { VerificationPage } from "../../../screens/VerificationPage/VerificationPage";

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="Verification" component={VerificationPage} />
  </Stack.Navigator>
);
