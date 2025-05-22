import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { styles } from "./ProductDetails.styles";
import { useCallback, useEffect, useState } from "react";
import { Product } from "./ProductDetails.type";
import { useThemeContext } from "../../store/themeContext/ThemeContext";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { GetProductApi } from "../../api/products/getProductById/GetProductApi";
import { API_BASE_URL } from "../../constants/apiConfig";
import { GoogleMaps } from "../../components/organisms/Maps/googleMaps";
import Swiper from "react-native-swiper";
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi";
import { retry } from "../../utils/retry";
import { useMutation } from "@tanstack/react-query";
import { DeleteProductApi } from "../../api/products/deleteProduct/DeleteProductApi";

export const ProductDetails = ({ route, navigation }: any) => {
    const { token } = useAuthStore()
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';
    const [productData, setProductData] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [userData, setUserData] = useState<any>(null)

    const fetchUser = useCallback(async () => {
        if (!token) {
            console.warn("No token found. Skipping API call.");
            return;
        }
        setUserData(null)
        const response = await retry(() => GetProfileApi({ accessToken: token?.data.accessToken }), 3, 1000)
        if (response) {
            setUserData(response.data.user)
        } else {
            console.log("No use")
        }
    }, [token])


    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const getProduct = useCallback(async () => {
        if (!token) {
            console.warn("No token found. Skipping API call.");
            return;
        }
        setProductData(null);
        const response = await GetProductApi(token?.data?.accessToken, route.params.productId);
        if (response) {
            setProductData(response);
        } else {
            console.log("No Product to show");
        }
    }, [token, route.params.productId]);



    useEffect(() => {
        getProduct()
    }, [getProduct, route.params.productId])

    const increaseQuantity = () => { setQuantity((prev) => prev + 1) };
    const decreaseQuantity = () => { setQuantity((prev) => (prev > 1 ? prev - 1 : 1)) };
    const isOwner = userData?.id && productData?.user?._id && userData.id === productData.user._id;

    const deleteProductMutation = useMutation({
        mutationFn: ({ id, accessToken }: { id: string; accessToken: string }) =>
            DeleteProductApi({ id, accessToken }),
        onSuccess: () => {
            Alert.alert("Success", "Product deleted successfully");
            navigation.goBack();
        },
        onError: (error: any) => {
            if (error.message.includes("401")) {
                Alert.alert("Session Expired", "Please log in again.");
            } else {
                Alert.alert("Error", error.message || "Failed to delete product");
            }
        },
    });
    const handleDeleteProduct = () => {
        if (!token?.data?.accessToken) {
            Alert.alert("Error", "You need to be logged in");
            return;
        }
        if (!productData?._id) {
            Alert.alert("Error", "Product ID not found");
            return;
        }
        deleteProductMutation.mutate({
            id: productData._id,
            accessToken: token.data.accessToken,
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {userData && productData && isOwner && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('EditProduct', { productId: productData?._id })}
                        >
                            <Text style={styles.editButton}>Edit Product</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDeleteProduct}
                        >
                            <Text style={styles.editButton}>Delete Product</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={[styles.content]}>
                    {(productData?.images?.length ?? 0) > 0 && (
                        <Swiper
                            style={styles.imageSwiper}
                            showsPagination={false}
                            autoplay={false}
                            height={300}
                            loop={false}
                        >
                            {productData?.images.map((img, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: `${API_BASE_URL}${img.url}` }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            ))}
                        </Swiper>
                    )}

                    <Text style={[styles.title, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>{productData?.title}</Text>
                    <Text style={styles.description}>{productData?.description}</Text>
                    <Text style={[styles.price, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>${productData?.price?.toFixed(2)}</Text>
                    <Text style={styles.stock}>In Stock</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
                            <Text style={styles.qtyText}>−</Text>
                        </TouchableOpacity>
                        <Text style={[styles.qtyCount, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>{quantity}</Text>
                        <TouchableOpacity style={styles.qtyButton} onPress={increaseQuantity}>
                            <Text style={styles.qtyText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mapContainer}>
                        {productData?.location && (
                            <GoogleMaps latitude={productData?.location?.latitude} longitude={productData?.location?.longitude} />
                        )}
                    </View>


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cartMainButton}>
                            <Image
                                source={require("../../assets/cart.png")}
                                style={styles.iconImageSmall}
                            />
                            <Text style={styles.cartText}>Add {quantity} to Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Image
                                source={require("../../assets/share.png")}
                                style={styles.iconImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};
