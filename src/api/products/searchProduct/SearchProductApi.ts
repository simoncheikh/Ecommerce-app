import axios from "axios"
import { API_BASE_URL } from "../../../constants/apiConfig"
import { SearchProductApiProps } from "./SearchProductApi.type"

export const SearchProductApi = async ({
    name,
    accessToken,
}: {
    name: string;
    accessToken: string;
}) => {
    const res = await axios.get(`${API_BASE_URL}/api/products/search?query=${name}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return res.data.data;
};