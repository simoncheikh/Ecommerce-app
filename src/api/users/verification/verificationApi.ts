import axios from "axios";
import { VerificationApiProps } from "./verificationApi.type";
import { API_BASE_URL } from "../../../constants/apiConfig";



export const verificationApi = async ({ email, otp }: VerificationApiProps) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`,
            {
                email: email,
                otp: otp
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}