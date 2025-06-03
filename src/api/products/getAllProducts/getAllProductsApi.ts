import axios from "axios";
import Config from "react-native-config";

export const GetAllProductsApi = async (
  accessToken: string,
  page = 1,
  limit = 10,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string,
  order: "asc" | "desc" = "desc"
) => {
  try {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
      order: order,
    };

    if (minPrice !== undefined) params.minPrice = String(minPrice);
    if (maxPrice !== undefined) params.maxPrice = String(maxPrice);
    if (sortBy) params.sortBy = sortBy;

    const response = await axios.get(`${Config.REACT_APP_API_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });

    return response.data; 
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return null;
  }
};
