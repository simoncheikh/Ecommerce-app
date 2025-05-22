import axios from "axios"
import { API_BASE_URL } from "../../../../constants/apiConfig"
import { ProfilePageProps } from "../../../../screens/ProfilePage/ProfilePage.type"



export const GetProfileApi = async ({ accessToken }: ProfilePageProps) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
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
