import axios from "axios"
import Config from "react-native-config";

export const GetProductApi = async (token: string | undefined, id: string) => {
    try {
        const response = await axios.get(`${Config.REACT_APP_API_URL}/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data?.success) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};
