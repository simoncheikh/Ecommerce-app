import axios from "axios";
import Config from "react-native-config";

export const resendVerificationApi = async (email: string) => {
    try {
        const response = await axios.post(`${Config.REACT_APP_API_URL}/api/auth/resend-verification-otp`, {
            email: email,
        });
        return { success: true, message: response.data.message };
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;

            if (status === 400) {
                return { success: false, message: "Email is already verified." };
            } else if (status === 404) {
                return { success: false, message: "User not found." };
            } else {
                return { success: false, message: "An unexpected error occurred." };
            }
        } else {
            return { success: false, message: "Network error. Please try again later." };
        }
    }
};
