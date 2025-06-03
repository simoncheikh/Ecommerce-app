import axios from "axios"
import { SearchProductApiProps } from "./SearchProductApi.type"
import Config from "react-native-config";

export const SearchProductApi = async ({
    name,
    accessToken,
}: {
    name: string;
    accessToken: string;
}) => {
    const res = await axios.get(`${Config.REACT_APP_API_URL}/api/products/search?query=${name}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return res.data.data;
};