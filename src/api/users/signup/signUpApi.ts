import axios from "axios";
import { SignUpProps } from "./signUpApi.type";
import Config from "react-native-config";

export const SignUpApi = async ({
  firstName,
  lastName,
  email,
  password,
  profileImage,
}: SignUpProps) => {
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

  const response = await axios.post(`${Config.REACT_APP_API_URL}/api/auth/signup`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    validateStatus: () => true, 
  });

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }

  const message = response.data?.message || "Sign up failed";
  throw new Error(message);
};

