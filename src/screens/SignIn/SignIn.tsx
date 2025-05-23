import { SafeAreaView, Text, View, TouchableOpacity, Alert } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { Button } from "../../components/atoms/Button/Button";
import { LoginButton } from "../../components/atoms/LoginButton/LoginButton";
import { styles } from "./SignIn.styles";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { LoginApi } from '../../api/users/login/LoginApi';
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
});

type FormData = z.infer<typeof schema>;

export const SignIn = ({ navigation }: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });


  const loginMutation = useMutation({
    mutationFn: (data: FormData) =>
      LoginApi({ email: data.email, password: data.password, tokenExpire: "1y" }),
    onSuccess: (token) => {
      if (token) {
        useAuthStore.getState().login(token);
      } else {
        Alert.alert("Login Failed", "Invalid username or password.");
      }
    },
    onError: () => {
      Alert.alert("Login Failed", "Something went wrong.");
    },
  });



  const theme = useThemeStore((state) => state.theme);

  const isDark = theme === 'dark';
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
      <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleLabel, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>Welcome Back!</Text>
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
          onClick={handleSubmit((data) => loginMutation.mutate(data))}
          label="SIGN IN"
          disabled={!isValid || loginMutation.isPending}
          variant="primary"
        />
      </View>
      <View style={styles.haveAnAccStyles}>
        <Text style={{ color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }}>You Don't Have An Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.loginStyle}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
