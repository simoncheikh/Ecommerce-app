import axios from "axios"
import { API_BASE_URL } from "../../../constants/apiConfig"

export const getAllProductsApi = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/products`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
