import axios from "axios"
import { API_BASE_URL } from "../../../constants/apiConfig"

export const GetProductApi = async (token: string, id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${id}`, {
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
