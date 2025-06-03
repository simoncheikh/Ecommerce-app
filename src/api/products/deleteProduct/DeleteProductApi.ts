import axios from "axios"
import { DeleteProductApiProps } from "./DeleteProductApi.type"
import Config from "react-native-config"


export const DeleteProductApi = async ({ accessToken, id }: DeleteProductApiProps) => {
    try {
        const response = await axios.delete(`${Config.REACT_APP_API_URL}/api/products/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        return response
    } catch (error) {
        console.error(error)
    }
}