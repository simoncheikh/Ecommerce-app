import {
    Alert,
    BackHandler,
    Image,
    Modal,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "./EditProfile.styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Config from "react-native-config";
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { useEffect, useState } from "react";
import { CameraVision } from "../../components/molecules/Camera/cameraVision";
import { Button } from "../../components/atoms/Button/Button";
import { GlobalStyles } from "../../styles/GobalStyles";
import { retry } from "../../utils/retry";
import { EditProfileApi } from "../../api/users/profile/editprofile/EditProfileApi";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { launchImageLibrary } from "react-native-image-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { useCameraStore } from "../../store/cameraStore/CameraStore";
import { SafeAreaView } from "react-native-safe-area-context";
import crashlytics from '@react-native-firebase/crashlytics';



const schema = z.object({
    firstName: z.string().min(2, { message: "FirstName must be at least 2 characters long" }),
    lastName: z.string().min(2, { message: "LastName must be at least 2 characters long" }),
    profileImage: z.string().nonempty("Profile image is required"),
});

type FormData = z.infer<typeof schema>;

export const EditProfile = ({ navigation }: any) => {
    const token = useAuthStore((state) => state.token);
    const theme = useThemeStore((state) => state.theme);
    const isCameraOpen = useCameraStore((state) => state.isCameraOpen);
    const setIsCameraOpen = useCameraStore((state) => state.setCameraOpen);
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);

    const isDarkMode = theme === "dark";
    const darkTheme = GlobalStyles.theme.darkTheme;
    const lightTheme = GlobalStyles.theme.lightTheme;

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
            profileImage: "",
        },
    });

    const { data: profileData } = useQuery({
        queryKey: ["user-profile"],
        queryFn: () => retry(() => GetProfileApi({ accessToken: token?.data.accessToken }), 3, 1000),
        enabled: !!token?.data.accessToken,
    });

    useEffect(() => {
        if (profileData?.data?.user) {
            const user = profileData.data.user;
            setValue("firstName", user.firstName || "");
            setValue("lastName", user.lastName || "");
            setValue("profileImage", user.profileImage?.url ? `${Config.REACT_APP_API_URL}${user.profileImage.url}` : "");
        } else {
            crashlytics().recordError(new Error('Failed fetch API'))
        }
    }, [profileData, setValue]);

    useEffect(() => {
        const backAction = () => {
            if (isCameraOpen) {
                setIsCameraOpen(false);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isCameraOpen]);

    const handlePhotoTaken = (uri: string) => {
        setValue("profileImage", uri, { shouldValidate: true });
        setIsCameraOpen(false);
    };

const handleChooseFromLibrary = async () => {
    try {
        setShowPhotoOptions(false);

        const permission = Platform.OS === "ios"
            ? PERMISSIONS.IOS.PHOTO_LIBRARY
            : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

        const result = await request(permission);
        if (result !== RESULTS.GRANTED) {
            crashlytics().log("Photo library permission denied");
            Alert.alert("Permission Denied", "You need to allow access to your photos.");
            return;
        }

        const image = await launchImageLibrary({
            mediaType: "photo",
            quality: 1,
            maxWidth: 1024,
            maxHeight: 1024,
        });

        const uri = image?.assets?.[0]?.uri;
        if (uri) {
            setValue("profileImage", uri, { shouldValidate: true });
        }
    } catch (error) {
        crashlytics().recordError(error instanceof Error ? error : new Error("Unknown error in handleChooseFromLibrary"));
    }
};


    const handleRemovePhoto = () => {
        setValue("profileImage", "", { shouldValidate: true });
    };

    const editProfileMutation = useMutation({
        mutationFn: (data: FormData) =>
            EditProfileApi({
                firstName: data.firstName,
                lastName: data.lastName,
                profileImage: data.profileImage,
                accessToken: token?.data.accessToken,
            }),
        onSuccess: () => {
            Alert.alert("User updated successfully");
            navigation.navigate("Home");
        },
        onError: (error: any) => {
            crashlytics().recordError(new Error(error))
            Alert.alert("Error", "User didn't update");
        },
    });

    const handleEditProfile = (data: FormData) => {
        editProfileMutation.mutate(data);
    };

    if (!token?.data?.accessToken) {
        crashlytics().log("Access token missing on EditProfile screen");
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view this page.</Text>
            </SafeAreaView>
        );
    }


    const currentTheme = isDarkMode ? darkTheme : lightTheme;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <View>
                <View style={styles.profileSection}>
                    <View style={styles.imageWrapper}>
                        <View style={{ position: "relative" }}>
                            <Image
                                style={styles.profileImage}
                                source={
                                    getValues("profileImage")
                                        ? { uri: getValues("profileImage") }
                                        : require("../../assets/profile.png")
                                }
                                resizeMode="cover"
                            />
                            <TouchableOpacity style={styles.editIcon} onPress={() => setShowPhotoOptions(true)}>
                                <Image
                                    source={require("../../assets/edit.png")}
                                    style={{ width: 20, height: 20, tintColor: GlobalStyles.color.primary }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={[styles.formCard, { backgroundColor: currentTheme.backgroundColor }]}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: currentTheme.color }]}>First Name</Text>
                        <Textfield control={control} name="firstName" placeholder="Enter First Name" />
                        {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: currentTheme.color }]}>Last Name</Text>
                        <Textfield control={control} name="lastName" placeholder="Enter Last Name" />
                        {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}
                    </View>
                </View>
            </View>

            <Modal
                visible={showPhotoOptions}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPhotoOptions(false)}
            >
                <View style={[styles.modalOverlay, { backgroundColor: currentTheme.backgroundColor + "cc" }]}>
                    <View style={[styles.modalContainer, { backgroundColor: currentTheme.backgroundColor }]}>
                        <Text style={[styles.modalTitle, { color: currentTheme.color }]}>Edit Photo</Text>

                        <TouchableOpacity style={styles.modalOption} onPress={() => {
                            setIsCameraOpen(true);
                            setShowPhotoOptions(false);
                        }}>
                            <Text style={[styles.modalOptionText, { color: currentTheme.color }]}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={handleChooseFromLibrary}>
                            <Text style={[styles.modalOptionText, { color: currentTheme.color }]}>Choose from Library</Text>
                        </TouchableOpacity>

                        {getValues("profileImage") && (
                            <TouchableOpacity style={styles.modalOption} onPress={handleRemovePhoto}>
                                <Text style={[styles.modalOptionText, { color: "red" }]}>Remove Photo</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoOptions(false)}>
                            <Text style={[styles.modalCancelText, { color: currentTheme.color }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.buttonWrapper}>
                <Button
                    label={editProfileMutation.isPending ? "Profile is updating" : "Save Changes"}
                    variant="primary"
                    disabled={!isValid || editProfileMutation.isPending}
                    onClick={handleSubmit(handleEditProfile)}
                />
            </View>

            <CameraVision
                visible={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onPhotoTaken={handlePhotoTaken}
            />
        </SafeAreaView>
    );
};
