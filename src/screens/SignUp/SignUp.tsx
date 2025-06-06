import React, { useState, useCallback, useMemo } from "react";
import { styles } from "./SignUp.styles";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { Button } from "../../components/atoms/Button/Button";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { SignUpApi } from "../../api/users/signup/signUpApi";
import { CameraVision } from "../../components/molecules/Camera/cameraVision";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { launchImageLibrary } from "react-native-image-picker";
import { useMutation } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import crashlytics from '@react-native-firebase/crashlytics'



const schema = z.object({
  firstName: z.string().min(2, { message: "FirstName must be at least 2 characters long" }),
  lastName: z.string().min(2, { message: "LastName must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  profileImage: z.string().nonempty("Profile image is required"),
});

type FormData = z.infer<typeof schema>;

export const SignUp = ({ navigation }: any) => {
  crashlytics().setAttribute('screen', 'SignUp');

  const theme = useThemeStore((state) => state.theme);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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

  const isDark = theme === "dark";
  const themeStyles = useMemo(() =>
    isDark ? GlobalStyles.theme.darkTheme : GlobalStyles.theme.lightTheme,
    [isDark]
  );

  const handlePhotoTaken = useCallback((uri: string) => {
    setValue("profileImage", uri, { shouldValidate: true });
    setCameraOpen(false);
  }, [setValue]);

  const showPhotoSelection = useCallback(() => {
    setShowPhotoOptions(true);
  }, []);

  const signUpMutation = useMutation({
    mutationFn: (data: FormData) => SignUpApi(data),
    onSuccess: (_, data) => {
      navigation.navigate("Verification", { email: data.email });
      crashlytics().log("User created");
    },
    onError: (error: any, variables: FormData) => {
      crashlytics().setUserId(variables.email);
      crashlytics().setAttributes({
        email: variables.email,
        firstName: variables.firstName,
        lastName: variables.lastName,
      });
      crashlytics().recordError(new Error("SignUp API failed: " + error.message));
      Alert.alert("Sign Up Failed", error.message);
    },

  });

  const handleSignUp = useCallback((data: FormData) => {
    crashlytics().log('SignUp form submitted');
    signUpMutation.mutate(data);
  }, [signUpMutation]);

  const handleTakePhoto = useCallback(() => {
    setCameraOpen(true);
    setShowPhotoOptions(false);
  }, []);

  const handleChooseFromLibrary = useCallback(async () => {
    try {
      setShowPhotoOptions(false);

      let permissionResult;
      if (Platform.OS === 'ios') {
        permissionResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      } else {
        permissionResult = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      }

      if (permissionResult !== RESULTS.GRANTED) {
        Alert.alert("Permission Denied", "You need to allow access to your photos.");
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) return;

      const uri = result.assets[0].uri;
      if (!uri) return;

      setValue("profileImage", uri, { shouldValidate: true });
    } catch (err) {
      crashlytics().recordError(new Error("Image picker failed: " + err));
    }
  }, [setValue]);


  const handleRemovePhoto = useCallback(() => {
    setValue("profileImage", "", { shouldValidate: true });
  }, [setValue]);

  const handleSignInNavigation = useCallback(() => {
    navigation.navigate("SignIn");
  }, [navigation]);

  const profileImage = getValues("profileImage");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View style={styles.innerContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleLabel, { color: themeStyles.color }]}>
              Sign Up
            </Text>
            <Text style={styles.descLabel}>
              Create an account to order your favorite products easily
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

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeStyles.color }]}>Profile Image</Text>
              <View style={styles.ImagesContainer}>
                {profileImage ? (
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImage}
                      onPress={handleRemovePhoto}
                    >
                      <Text style={styles.removeText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={showPhotoSelection}
                      style={styles.changeProfileImage}
                    >
                      <Text style={styles.changeText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={showPhotoSelection}
                    style={[styles.addProfileImage, { backgroundColor: themeStyles.backgroundColor }]}
                  >
                    <Text style={[styles.addText, { color: themeStyles.color }]}>＋</Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.profileImage && <Text style={styles.error}>{errors.profileImage.message}</Text>}
            </View>
          </View>

          <Modal
            visible={showPhotoOptions}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPhotoOptions(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContainer, { backgroundColor: themeStyles.backgroundColor }]}>
                <Text style={[styles.modalTitle, { color: themeStyles.color }]}>Add Photo</Text>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleTakePhoto}
                >
                  <Text style={[styles.modalOptionText, { color: themeStyles.color }]}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleChooseFromLibrary}
                >
                  <Text style={[styles.modalOptionText, { color: themeStyles.color }]}>Choose from Library</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowPhotoOptions(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Button
            onClick={handleSubmit(handleSignUp)}
            label={signUpMutation.isPending ? "Creating user" : "SIGN UP"}
            disabled={!isValid || signUpMutation.isPending}
            variant="primary"
          />
        </View>

        <View style={styles.haveAnAccStyles}>
          <Text style={{ color: themeStyles.color }}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={handleSignInNavigation}>
            <Text style={styles.loginStyle}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CameraVision
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onPhotoTaken={handlePhotoTaken}
      />
    </SafeAreaView>
  );
};