import { Alert, BackHandler, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { styles } from "./EditProfile.styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL } from "../../constants/apiConfig";
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { Textfield } from "../../components/atoms/Textfield/Textfield";
import { useCallback, useEffect, useState } from "react";
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

const schema = z.object({
    firstName: z.string().min(2, { message: "FirstName must be at least 2 characters long" }),
    lastName: z.string().min(2, { message: "LastName must be at least 2 characters long" }),
    profileImage: z.string().nonempty("Profile image is required"),
});

type FormData = z.infer<typeof schema>;

export const EditProfile = ({ navigation }: any) => {
    const { token } = useAuthStore();
    const [userData, setUserData] = useState<any>(null);
    const theme = useThemeStore((state) => state.theme)
    const isCameraOpen = useCameraStore((state) => state.isCameraOpen)
    const setIsCameraOpen = useCameraStore((state) => state.setCameraOpen);
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);

    const isDarkMode = theme == 'dark'

    const darkTheme = GlobalStyles.theme.darkTheme
    const lightTheme = GlobalStyles.theme.lightTheme

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

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: () =>
            retry(() => GetProfileApi({ accessToken: token?.data.accessToken }), 3, 1000),
        enabled: !!token?.data.accessToken,
    });


    useEffect(() => {
        if (profileData?.data?.user) {
            const user = profileData.data.user;
            setUserData(user);
            setValue("firstName", user.firstName || "");
            setValue("lastName", user.lastName || "");
            setValue("profileImage", user.profileImage?.url ? `${API_BASE_URL}${user.profileImage.url}` : "");
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

    const showPhotoSelection = () => {
        setShowPhotoOptions(true);
    };

    const handleTakePhoto = () => {
        setIsCameraOpen(true);
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
        onError: () => {
            Alert.alert("Error", "User didn't update");
        },
    });


    const handleEditProfile = async (data: FormData) => {
        editProfileMutation.mutate({
            firstName: data.firstName,
            lastName: data.lastName,
            profileImage: data.profileImage,
        });
    };


    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
            ]}
        >
            <View>
                <View style={styles.profileSection}>
                    <View style={styles.imageWrapper}>
                        {getValues("profileImage") ? (
                            <View style={{ position: "relative" }}>
                                <Image
                                    style={styles.profileImage}
                                    source={{ uri: getValues("profileImage") }}
                                    resizeMode="center"
                                />
                                <TouchableOpacity style={styles.editIcon} onPress={showPhotoSelection}>
                                    <Image
                                        source={require("../../assets/edit.png")}
                                        style={{ width: 20, height: 20, tintColor: GlobalStyles.color.primary }}
                                        resizeMethod="scale"
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ position: "relative" }}>
                                <Image
                                    style={styles.profileImage}
                                    source={require("../../assets/profile.png")}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity style={styles.editIcon} onPress={showPhotoSelection}>
                                    <Image
                                        source={require("../../assets/edit.png")}
                                        style={{ width: 20, height: 20, tintColor: GlobalStyles.color.primary }}
                                        resizeMethod="scale"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <View
                    style={[
                        styles.formCard,
                        { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
                    ]}
                >
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                            First Name
                        </Text>
                        <Textfield control={control} name="firstName" placeholder="Enter First Name" />
                        {errors.firstName && (
                            <Text style={[styles.error, { color: "red" }]}>{errors.firstName.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                            Last Name
                        </Text>
                        <Textfield control={control} name="lastName" placeholder="Enter Last Name" />
                        {errors.lastName && (
                            <Text style={[styles.error, { color: "red" }]}>{errors.lastName.message}</Text>
                        )}
                    </View>
                </View>
            </View>

            <Modal
                visible={showPhotoOptions}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPhotoOptions(false)}
            >
                <View
                    style={[
                        styles.modalOverlay,
                        { backgroundColor: (isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor) + "cc" },
                    ]}
                >
                    <View
                        style={[
                            styles.modalContainer,
                            { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
                        ]}
                    >
                        <Text style={[styles.modalTitle, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                            Edit Photo
                        </Text>

                        <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
                            <Text style={[styles.modalOptionText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                                Take Photo
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={handleChooseFromLibrary}>
                            <Text style={[styles.modalOptionText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                                Choose from Library
                            </Text>
                        </TouchableOpacity>

                        {getValues("profileImage") && (
                            <TouchableOpacity style={styles.modalOption} onPress={handleRemovePhoto}>
                                <Text style={[styles.modalOptionText, { color: "red" }]}>Remove Photo</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoOptions(false)}>
                            <Text style={[styles.modalCancelText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.buttonWrapper}>
                <Button
                    label={editProfileMutation.isPending ? 'Profile is updating' : "Save Changes"}
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