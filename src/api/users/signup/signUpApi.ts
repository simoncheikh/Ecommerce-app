import axios from "axios";
import { SignUpProps } from "./signUpApi.type";
import { API_BASE_URL } from "../../../constants/apiConfig";

export const SignUpApi = async ({
    firstName,
    lastName,
    email,
    password,
    profileImage,
}: SignUpProps) => {
    try {
        const formData = new FormData();

        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);

        formData.append("profileImage", {
            uri: profileImage,
            name: profileImage.split("/").pop(), 
            type: "image/jpeg", 
        });

        const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("User already exist", error);
        return null;
    }
};
