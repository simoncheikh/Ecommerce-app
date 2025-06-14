import axios from "axios";
import { AddProductApiProps } from "./AddProductApi.type";
import Config from "react-native-config";

export const AddProductApi = async ({ 
    title, 
    description, 
    price, 
    location, 
    images,
    accessToken 
}: AddProductApiProps) => {
    if (!accessToken) throw new Error("Authentication token is required");
    if (!location.longitude || !location.latitude) {
        throw new Error("Location coordinates are required");
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    
    formData.append("location", JSON.stringify({
        name: location.name || "",
        longitude: Number(location.longitude),
        latitude: Number(location.latitude)
    }));

    images.forEach((image, index) => {
        if (image.url.startsWith('file:')) {
            const fileName = image.url.split('/').pop() || `product_image_${index}.jpg`;
            const fileType = fileName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
            
            formData.append("images", {
                uri: image.url,
                name: fileName,
                type: fileType,
            } as any);
        } else {
            formData.append("images", image.url);
        }
    });

    try {
        const response = await axios.post(
            `${Config.REACT_APP_API_URL}/api/products`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                timeout: 30000,
            }
        );
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || "Failed to add product";
            console.error("API Error:", {
                message: errorMessage,
                status: error.response?.status,
                data: error.response?.data,
            });
            throw new Error(errorMessage);
        }
        throw error;
    }
};