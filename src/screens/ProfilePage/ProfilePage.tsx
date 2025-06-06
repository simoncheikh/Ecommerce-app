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
import crashlytics from '@react-native-firebase/crashlytics';



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

    useEffect(() => {
        if (userError) {
            crashlytics().log("Error fetching user profile data");
            crashlytics().recordError(userError as Error);
        }
    }, [userError]);


    const refetchProfile = useCallback(() => {
        refetch();
    }, [refetch]);

    useFocusEffect(refetchProfile);

    if (!isLoggedIn || !token?.data?.accessToken) {
        crashlytics().log("Unauthorized access attempt to ProfilePage");
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view profile.</Text>
            </SafeAreaView>
        );
    }


    if (userLoading) {
        return (
            <View style={[styles.container, { width: '100%', elevation: 0, paddingTop: '30%', backgroundColor: backgroundColor }]}>
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
                <Pressable
                    onLongPress={() => {
                        if (profileImageUri) {
                            crashlytics().log("User long-pressed profile image to save");
                            saveImageToGallery(profileImageUri);
                        }
                    }}
                >
                    <Image
                        style={styles.profileImage}
                        source={{ uri: profileImageUri }}
                    />
                </Pressable>
                <Text style={[styles.name, { color: textColor }]}>
                    {userData?.data?.user?.firstName} {userData?.data?.user?.lastName}
                </Text>
                <Text style={[styles.email, {
                    color: isDarkMode ? "#66b2ff" : "#0066cc",
                }]}>
                    {userData?.data?.user?.email}
                </Text>
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