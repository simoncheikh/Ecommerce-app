import React, { useState } from "react";
import { styles } from "./SignUp.styles";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { Button } from "../../components/atoms/Button/Button";
import { LoginButton } from "../../components/atoms/LoginButton/LoginButton";
import { useThemeContext } from "../../store/themeContext/ThemeContext";
import { GlobalStyles } from "../../styles/GobalStyles";
import { SignUpApi } from "../../api/users/signup/signUpApi";
import { CameraVision } from "../../components/molecules/Camera/cameraVision";

const schema = z.object({
  firstName: z.string().min(2, { message: "FirstName must be at least 2 characters long" }),
  lastName: z.string().min(2, { message: "LastName must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  profileImage: z.string().nonempty("Profile image is required"),
});

type FormData = z.infer<typeof schema>;

export const SignUp = ({ navigation }: any) => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const [cameraOpen, setCameraOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      profileImage: "",
    },
  });

  const handlePhotoTaken = (uri: string) => {
    console.log("Captured URI:", uri);
    setValue("profileImage", uri, { shouldValidate: true });
    setCameraOpen(false);
  };

  const handleSignUp = async (data: FormData) => {
    const success = await SignUpApi(data);
    if (success) {
      navigation.navigate("Verification", { email: data.email });
    } else {
      Alert.alert('User already exist');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? GlobalStyles.theme.darkTheme.backgroundColor
            : GlobalStyles.theme.lightTheme.backgroundColor,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.titleLabel,
              {
                color: isDark
                  ? GlobalStyles.theme.darkTheme.color
                  : GlobalStyles.theme.lightTheme.color,
              },
            ]}
          >
            Sign Up
          </Text>
          <Text style={styles.descLabel}>
            Create an account so you can order your favorite products easily and quickly
          </Text>
        </View>

        <View style={styles.fieldsContainer}>
          <View>
            <Textfield control={control} name="firstName" placeholder="First Name" />
            {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}
          </View>
          <View>
            <Textfield control={control} name="lastName" placeholder="Last Name" />
            {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}
          </View>
          <View>
            <Textfield control={control} name="email" placeholder="Email" />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
          </View>
          <View>
            <Textfield control={control} name="password" placeholder="Password" />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>

          <View style={{ marginTop: 16 }}>
            <TouchableOpacity onPress={() => setCameraOpen(true)}>
              <Text style={{ color: "#007bff" }}>Capture Profile Image</Text>
            </TouchableOpacity>
            <Controller
              control={control}
              name="profileImage"
              render={({ field: { value } }) => (
                <View>
                  {value ? (
                    <Image
                      source={{ uri: value }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>
                        No image selected
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
            {errors.profileImage && <Text style={styles.error}>{errors.profileImage.message}</Text>}
          </View>
        </View>

        <Button
          onClick={handleSubmit(handleSignUp)}
          label="SIGN UP"
          disabled={!isValid}
          variant="primary"
        />
      </View>

      <View style={styles.haveAnAccStyles}>
        <Text
          style={{
            color: isDark
              ? GlobalStyles.theme.darkTheme.color
              : GlobalStyles.theme.lightTheme.color,
          }}
        >
          Already Have An Account?{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.loginStyle}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <CameraVision
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onPhotoTaken={handlePhotoTaken}
      />
    </SafeAreaView>
  );
};
