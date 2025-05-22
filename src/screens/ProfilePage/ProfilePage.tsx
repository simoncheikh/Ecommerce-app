import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { styles } from './ProfilePage.styles'
import { useCallback, useEffect, useState } from "react"
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi"
import { useAuthStore } from "../../store/sessionStore/AuthStore"
import { API_BASE_URL } from "../../constants/apiConfig"
import { Button } from "../../components/atoms/Button/Button"
import { retry } from "../../utils/retry"


export const ProfilePage = ({ navigation }: any) => {
    const { token } = useAuthStore()

    const [userData, setUserData] = useState<any>(null)

    const fetchUser = useCallback(async () => {
        if (!token) {
            console.warn("No token found. Skipping API call.");
            return;
        }
        setUserData(null)
        const response = await retry(() => GetProfileApi({ accessToken: token?.data.accessToken }), 3, 1000)
        if (response) {
            setUserData(response.data.user)
        } else {
            console.log("No user")
        }
    }, [token])


    useEffect(() => {
        fetchUser()
    }, [fetchUser])


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button onClick={fetchUser} label="Refresh" disabled={false} />

                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={() => navigation.navigate("EditProfile", { userData })}>
                    <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: `${API_BASE_URL}${userData?.profileImage?.url}` }}
                />
                <Text style={styles.name}>{userData?.firstName} {userData?.lastName}</Text>
                <Text style={styles.email}>{userData?.email}</Text>
                <Text style={styles.verified}>
                    {userData?.isEmailVerified ? "✅ Verified Email" : "❌ Not Verified"}
                </Text>
                <Text style={styles.joinedAt}>Joined on {new Date(userData?.createdAt).toDateString()}</Text>
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
    )
}