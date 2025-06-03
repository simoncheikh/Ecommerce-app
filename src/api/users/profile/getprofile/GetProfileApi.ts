import axios from "axios"
import { ProfilePageProps } from "../../../../screens/ProfilePage/ProfilePage.type"
import Config from "react-native-config";



export const GetProfileApi = async ({ accessToken }: ProfilePageProps) => {
    try {
        const response = await axios.get(`${Config.REACT_APP_API_URL}/api/user/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        return response.data;
    } catch (error) {
        console.error(error)
    }
};
