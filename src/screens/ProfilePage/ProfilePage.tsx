import { Image, SafeAreaView, Text, TouchableOpacity, View, Linking, Alert, Platform, Pressable } from "react-native";
import { styles } from './ProfilePage.styles';
import { useCallback, useEffect, useState } from "react";
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { API_BASE_URL } from "../../constants/apiConfig";
import { Button } from "../../components/atoms/Button/Button";
import { retry } from "../../utils/retry";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { saveImageToGallery } from "../../utils/SaveImageToGallery";

export const ProfilePage = ({ navigation }: any) => {
    const { token } = useAuthStore();
    const theme = useThemeStore((state) => state.theme)
    const isDarkMode = theme == 'dark'

    const darkTheme = GlobalStyles.theme.darkTheme
    const lightTheme = GlobalStyles.theme.lightTheme


    const {
        data: userData,
        isLoading: userLoading,
        error: userError,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: () => {
            if (!token?.data?.accessToken) {
                return Promise.reject(new Error("No access token"));
            }
            return retry(() => GetProfileApi({ accessToken: token.data.accessToken }), 3, 1000);
        },
        enabled: !!token?.data?.accessToken,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });


    const openGmailCompose = async (email: string) => {
        const gmailIntentUrl = `googlegmail://co?to=${email}`;
        const mailtoUrl = `mailto:${email}`;
        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

        try {
            if (Platform.OS === 'android') {
                try {
                    await Linking.openURL(gmailIntentUrl);
                    return;
                } catch (err) {
                    console.warn("Gmail app not available");
                }
            }

            try {
                await Linking.openURL(mailtoUrl);
                return;
            } catch (err) {
                console.warn("No mailto handler available");
            }

            try {
                await Linking.openURL(gmailWebUrl);
                return;
            } catch (err) {
                console.warn("Can't open Gmail web");
            }

            Alert.alert(
                "No Email App Found",
                "Please install Gmail or another email app, or open Gmail in a browser.",
                [{ text: "OK" }]
            );
        } catch (err) {
            console.error("Unexpected error opening email client", err);
            Alert.alert(
                "Error",
                "Could not open any email client.",
                [{ text: "OK" }]
            );
        }
    };

    const handleEmailPress = () => {
        if (!userData?.data?.user?.email) return;
        openGmailCompose(userData?.data?.user?.email);
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor },
            ]}
        >
            <View style={styles.header}>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: isDarkMode ? darkTheme.color : lightTheme.color },
                    ]}
                >
                    My Profile
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("EditProfile", { userData })}>
                    <Text
                        style={[
                            styles.editButton,
                            { color: isDarkMode ? darkTheme.color : lightTheme.color },
                        ]}
                    >
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.profileSection, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
                <Pressable onLongPress={() => saveImageToGallery(`${API_BASE_URL}${userData?.data?.user?.profileImage?.url}`)}>
                    <Image
                        style={styles.profileImage}
                        source={{ uri: `${API_BASE_URL}${userData?.data?.user?.profileImage?.url}` }}
                    />
                </Pressable>
                <Text
                    style={[
                        styles.name,
                        { color: isDarkMode ? darkTheme.color : lightTheme.color },
                    ]}
                >
                    {userData?.data?.user?.firstName} {userData?.data?.user?.lastName}
                </Text>
                <TouchableOpacity onPress={handleEmailPress}>
                    <Text
                        style={[
                            styles.email,
                            {
                                textDecorationLine: "underline",
                                color: isDarkMode ? "#66b2ff" : "#0066cc",
                            },
                        ]}
                    >
                        {userData?.data?.user?.email}
                    </Text>
                </TouchableOpacity>
                <Text
                    style={[
                        styles.verified,
                        { color: isDarkMode ? darkTheme.color : lightTheme.color },
                    ]}
                >
                    {userData?.data?.user?.isEmailVerified ? "✅ Verified Email" : "❌ Not Verified"}
                </Text>
                <Text
                    style={[
                        styles.joinedAt,
                        { color: isDarkMode ? darkTheme.color : lightTheme.color },
                    ]}
                >
                    Joined on {new Date(userData?.data?.user?.createdAt).toDateString()}
                </Text>
            </View>

            <View style={styles.actionButton}>
                <Button
                    label="Add Product"
                    variant="primary"
                    disabled={false}
                    onClick={() => navigation.navigate("AddProduct")}
                />
            </View>
        </SafeAreaView>
    );
};