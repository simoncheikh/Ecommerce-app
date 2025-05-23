import React, { useState } from "react";
import { styles } from "./SignUp.styles";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Platform
} from "react-native";
import { useForm, Controller } from "react-hook-form";
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

const schema = z.object({
  firstName: z.string().min(2, { message: "FirstName must be at least 2 characters long" }),
  lastName: z.string().min(2, { message: "LastName must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  profileImage: z.string().nonempty("Profile image is required"),
});

type FormData = z.infer<typeof schema>;

export const SignUp = ({ navigation }: any) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
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

  const handlePhotoTaken = (uri: string) => {
    setValue("profileImage", uri, { shouldValidate: true });
    setCameraOpen(false);
  };

  const showPhotoSelection = () => {
    setShowPhotoOptions(true);
  };

  const signUpMutation = useMutation({
    mutationFn: (data: FormData) => SignUpApi(data),
    onSuccess: (_, data) => {
      navigation.navigate("Verification", { email: data.email });
    },
    onError: () => {
      Alert.alert("User already exists");
    },
  });


  const handleTakePhoto = () => {
    setCameraOpen(true);
    setShowPhotoOptions(false);
  };

  const handleChooseFromLibrary = async () => {
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
  };

  const handleRemovePhoto = () => {
    setValue("profileImage", "", { shouldValidate: true });
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
            <Text style={styles.label}>Profile Image</Text>
            <View style={styles.ImagesContainer}>
              {getValues("profileImage") ? (
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{ uri: getValues("profileImage") }}
                    style={styles.profileImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImage}
                    onPress={handleRemovePhoto}
                  >
                    <Text style={styles.removeText}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={showPhotoSelection}
                    style={styles.changeProfileImage}
                  >
                    <Text style={styles.changeText}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={showPhotoSelection}
                  style={styles.addProfileImage}
                >
                  <Text style={styles.addText}>＋</Text>
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
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Photo</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleTakePhoto}
              >
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleChooseFromLibrary}
              >
                <Text style={styles.modalOptionText}>Choose from Library</Text>
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
          onClick={handleSubmit((data) => signUpMutation.mutate(data))}
          label={signUpMutation.isPending ? "Creating user" : "SIGN UP"}
          disabled={!isValid || signUpMutation.isPending}
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
          Already have an account?{" "}
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