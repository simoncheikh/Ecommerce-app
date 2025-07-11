import axios from "axios";
import { VerificationApiProps } from "./verificationApi.type";
import Config from "react-native-config";



export const verificationApi = async ({ email, otp }: VerificationApiProps) => {
    try {
        const response = await axios.post(`${Config.REACT_APP_API_URL}/api/auth/verify-otp`,
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