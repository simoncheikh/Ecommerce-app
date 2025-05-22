import axios from "axios";
import { API_BASE_URL } from "../../../../constants/apiConfig";
import { EditProfileApiProps } from "./EditProfileApi.type";

export const EditProfileApi = async ({
    firstName,
    lastName,
    profileImage,
    accessToken,
}: EditProfileApiProps) => {
    const formData = new FormData();

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);

    if (profileImage) {
        if (profileImage.startsWith('file:')) {
            const fileName = profileImage.split('/').pop() || `profile_${Date.now()}.jpg`;
            const fileType = fileName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
            
            const file = {
                uri: profileImage,
                name: fileName,
                type: fileType,
            };
            
            formData.append("profileImage", file as any);
        }
    }

    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/user/profile`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                timeout: 30000, 
                maxBodyLength: Infinity,
                maxContentLength: Infinity, 
            }
        );

        return response.data;
    } catch (error: any) {
        let errorMessage = "Failed to update profile";
        
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timed out. Please check your connection and try again.";
            } else if (error.response) {
                errorMessage = error.response.data?.message || 
                               `Server error: ${error.response.status}`;
                console.error("Server Error:", error.response.data);
            } else if (error.request) {
                errorMessage = "No response from server. Please check your connection.";
                console.error("No Response:", error.request);
            }
        } else {
            errorMessage = error.message || "Unknown error occurred";
            console.error("Error:", error);
        }

        console.error("Error Config:", error?.config);
        throw new Error(errorMessage); 
    }
};