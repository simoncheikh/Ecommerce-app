import { Image, Text, TouchableOpacity, View, Linking, Alert, Platform, Pressable } from "react-native";
import { styles } from './ProfilePage.styles';
import { useCallback, useEffect, useState } from "react";
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import Config from "react-native-config";
import { Button } from "../../components/atoms/Button/Button";
import { retry } from "../../utils/retry";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { saveImageToGallery } from "../../utils/SaveImageToGallery";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SafeAreaView } from "react-native-safe-area-context";


export const ProfilePage = ({ navigation }: any) => {
    const theme = useThemeStore((state) => state.theme);
    const token = useAuthStore((state) => state.token);
    const isLoggedIn = !!token;
    const isDarkMode = theme === 'dark';

    const backgroundColor = isDarkMode
        ? GlobalStyles.theme.darkTheme.backgroundColor
        : GlobalStyles.theme.lightTheme.backgroundColor;
    const textColor = isDarkMode
        ? GlobalStyles.theme.darkTheme.color
        : GlobalStyles.theme.lightTheme.color;

    const {
        data: userData,
        isLoading: userLoading,
        error: userError,
        refetch
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

    const refetchProfile = useCallback(() => {
        refetch();
    }, [refetch]);

    useFocusEffect(refetchProfile);

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
        openGmailCompose(userData.data.user.email);
    };



    if (!isLoggedIn || !token?.data?.accessToken) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view profile.</Text>
            </SafeAreaView>
        );
    }

    if (userLoading) {
        return (
            <View style={[styles.container, { width: '100%', borderWidth: 1, elevation: 0 }]}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item flexDirection="column" alignItems="center" padding={10} gap={10} width={"100%"}>
                        <SkeletonPlaceholder.Item width={'80%'} height={100} borderRadius={5} />
                        <SkeletonPlaceholder.Item marginLeft={20}>
                            <SkeletonPlaceholder.Item width={120} height={20} />
                            <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>
        );
    }

    const profileImageUri = userData?.data?.user?.profileImage?.url
        ? `${Config.REACT_APP_API_URL}${userData.data.user.profileImage.url}`
        : undefined;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: textColor }]}>
                    My Profile
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("EditProfile", { userData })}>
                    <Text style={[styles.editButton, { color: textColor }]}>
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.profileSection, { backgroundColor }]}>
                <Pressable onLongPress={() => profileImageUri && saveImageToGallery(profileImageUri)}>
                    <Image
                        style={styles.profileImage}
                        source={{ uri: profileImageUri }}
                    />
                </Pressable>
                <Text style={[styles.name, { color: textColor }]}>
                    {userData?.data?.user?.firstName} {userData?.data?.user?.lastName}
                </Text>
                <TouchableOpacity onPress={handleEmailPress}>
                    <Text style={[styles.email, {
                        textDecorationLine: "underline",
                        color: isDarkMode ? "#66b2ff" : "#0066cc",
                    }]}>
                        {userData?.data?.user?.email}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.verified, { color: textColor }]}>
                    {userData?.data?.user?.isEmailVerified ? "✅ Verified Email" : "❌ Not Verified"}
                </Text>
                <Text style={[styles.joinedAt, { color: textColor }]}>
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