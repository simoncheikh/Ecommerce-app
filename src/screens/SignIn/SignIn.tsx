import { Text, View, TouchableOpacity, Alert } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { Button } from "../../components/atoms/Button/Button";
import { styles } from "./SignIn.styles";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { LoginApi } from "../../api/users/login/loginApi";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import crashlytics from '@react-native-firebase/crashlytics'


const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
});

type FormData = z.infer<typeof schema>;

export const SignIn = memo(({ navigation }: any) => {
  crashlytics().setAttribute('screen', 'SignIn');
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  const themeStyles = isDark ? GlobalStyles.theme.darkTheme : GlobalStyles.theme.lightTheme;

  const loginMutation = useMutation({
    mutationFn: (data: FormData) =>
      LoginApi({ email: data.email, password: data.password, tokenExpire: "1y" }),
    onSuccess: (token) => {
      if (token) {
        crashlytics().log('User logged in successfully');
        useAuthStore.getState().login(token);
      } else {
        crashlytics().log('Login failed - invalid token received');
        Alert.alert("Login Failed", "Invalid username or password.");
      }
    },
    onError: (error) => {
      crashlytics().recordError(new Error('Login API failed: ' + error.message));
      Alert.alert("Login Failed", "Something went wrong.");
    },
  });

  const handleLogin = useCallback((data: FormData) => {
    loginMutation.mutate(data);
  }, [loginMutation]);

  const handleSignUpNavigation = useCallback(() => {
    navigation.navigate("SignUp");
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleLabel, { color: themeStyles.color }]}>Welcome Back!</Text>
          <Text style={styles.descLabel}>Sign in to your account.</Text>
        </View>
        <View style={styles.fieldsContainer}>
          <View>
            <Textfield
              control={control}
              name="email"
              placeholder="Email"
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
          </View>
          <View>
            <Textfield
              control={control}
              name="password"
              placeholder="Password"
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>
        </View>
        <Button
          onClick={handleSubmit(handleLogin)}
          label={loginMutation.isPending ? "Trying to logging in" : "SIGN IN"}
          disabled={!isValid || loginMutation.isPending}
          variant="primary"
        />
      </View>
      <View style={styles.haveAnAccStyles}>
        <Text style={{ color: themeStyles.color }}>You Don't Have An Account? </Text>
        <TouchableOpacity onPress={handleSignUpNavigation}>
          <Text style={styles.loginStyle}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});