import axios from "axios"
import { API_BASE_URL } from "../../../constants/apiConfig"
import { DeleteProductApiProps } from "./DeleteProductApi.type"


export const DeleteProductApi = async ({ accessToken, id }: DeleteProductApiProps) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/products/${id}`,
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