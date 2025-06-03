import axios from "axios"
import { EditProductApiProps } from "./EditProductApiProps";
import Config from "react-native-config";


export const EditProductApi = async ({
    id,
    title,
    description,
    price,
    location,
    images,
    accessToken }: EditProductApiProps) => {
    if (!accessToken) throw new Error("Authentication token is required");
    if (!location.longitude || !location.latitude) {
        throw new Error("Location coordinates are required");
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());

    formData.append("location[name]", location.name || "");
    formData.append("location[longitude]", location.longitude.toString());
    formData.append("location[latitude]", location.latitude.toString());

images.forEach((image, index) => {
    if (image.url.startsWith('file:')) {
        const fileName = image.url.split('/').pop() || `product_image_${index}.jpg`;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        let fileType = "image/jpeg"; 
        
        if (fileExtension === 'png') {
            fileType = "image/png";
        } else if (fileExtension === 'gif') {
            fileType = "image/gif";
        } else if (fileExtension === 'webp') {
            fileType = "image/webp";
        }
        
        formData.append("images", {
            uri: image.url,
            name: fileName,
            type: fileType,
        } as any);
    } else if (image.url.startsWith('http://') || image.url.startsWith('https://')) {
        formData.append("images", image.url);
    } else {
        const fileName = `product_image_${index}.jpg`;
        formData.append("images", {
            uri: image.url,
            name: fileName,
            type: "image/jpeg",
        } as any);
    }
});

    try {
        const response = await axios.put(`${Config.REACT_APP_API_URL}/api/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`,
            },
            timeout: 30000,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Full error details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config,
            });
            throw new Error(error.response?.data?.error?.message || "Failed to edit product");
        }
        throw error;
    }
};