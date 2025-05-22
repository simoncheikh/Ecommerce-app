import { Alert, BackHandler, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./EditProfile.styles";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
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


const schema = z.object({
    firstName: z.string().min(2, { message: "FirstName must be at least 2 characters long" }),
    lastName: z.string().min(2, { message: "LastName must be at least 2 characters long" }),
    profileImage: z.string().nonempty("Profile image is required"),
});

type FormData = z.infer<typeof schema>;

export const EditProfile = ({ navigation }: any) => {
    const { token } = useAuthStore();
    const [userData, setUserData] = useState<any>(null);
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
            profileImage: "",
        },
    });

    const fetchUser = useCallback(async () => {
        if (!token) {
            console.warn("No token found. Skipping API cal.");
            return;
        }

        setUserData(null);

        try {
            const response = await retry(() => GetProfileApi({ accessToken: token?.data.accessToken }), 3, 1000);
            if (response) {
                const user = response.data.user;
                setUserData(user);

                setValue("firstName", user.firstName || "");
                setValue("lastName", user.lastName || "");
                setValue("profileImage", user.profileImage?.url ? `${API_BASE_URL}${user.profileImage.url}` : "");
            } else {
                console.log("No user");
            }
        } catch (err) {
            console.error("Failed to fetch user after 3 retries:", err);
        }
    }, [token, setValue]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        const backAction = () => {
            if (cameraOpen) {
                setCameraOpen(false);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove();
    }, [cameraOpen]);


    const handlePhotoTaken = (uri: string) => {
        setValue("profileImage", uri, { shouldValidate: true });
        setCameraOpen(false);
    };


    const handleEditProfile = async (data: FormData) => {
        const success = await EditProfileApi({ firstName: data.firstName, lastName: data.lastName, profileImage: data.profileImage, accessToken: token?.data.accessToken })
        if (success) {
            navigation.navigate("Home")
        } else {
            Alert.alert("User didn't updated")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.profileSection}>
                    <View style={styles.imageWrapper}>
                        <Image
                            style={styles.profileImage}
                            source={
                                control._formValues.profileImage
                                    ? { uri: control._formValues.profileImage }
                                    : userData?.profileImage?.url
                                        ? { uri: `${API_BASE_URL}${userData.profileImage.url}` }
                                        : require("../../assets/profile.png")
                            }
                            resizeMode="cover"
                        />

                        <TouchableOpacity style={styles.editIcon} onPress={() => setCameraOpen(true)}>
                            <Image
                                source={require("../../assets/edit.png")}
                                style={{ width: 20, height: 20, tintColor: GlobalStyles.color.primary }}
                                resizeMethod="scale"
                            />
                        </TouchableOpacity>

                    </View>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <Textfield control={control} name="firstName" placeholder="Enter First Name" />
                        {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <Textfield control={control} name="lastName" placeholder="Enter Last Name" />
                        {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}
                    </View>
                </View>
            </View>
            <View style={styles.buttonWrapper}>
                <Button
                    label="Save Changes"
                    variant="primary"
                    disabled={!isValid}
                    onClick={handleSubmit(handleEditProfile)}
                />
            </View>
            {cameraOpen && (
                <View style={[StyleSheet.absoluteFillObject, { zIndex: 999 }]}>
                    <CameraVision
                        visible={cameraOpen}
                        onClose={() => setCameraOpen(false)}
                        onPhotoTaken={handlePhotoTaken}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};
