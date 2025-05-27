import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    Pressable,
} from "react-native";
import { styles } from "./ProductDetails.styles";
import { useCallback, useEffect, useState } from "react";
import { Product } from "./ProductDetails.type";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { GetProductApi } from "../../api/products/getProductById/GetProductApi";
import { API_BASE_URL } from "../../constants/apiConfig";
import { GoogleMaps } from "../../components/organisms/Maps/googleMaps";
import Swiper from "react-native-swiper";
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi";
import { retry } from "../../utils/retry";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeleteProductApi } from "../../api/products/deleteProduct/DeleteProductApi";
import { Button } from "../../components/atoms/Button/Button";
import { useFocusEffect } from "@react-navigation/native";
import { saveImageToGallery } from "../../utils/SaveImageToGallery";
import { useCartStore } from "../../store/cartStore/cartStore";

export const ProductDetails = ({ route, navigation }: any) => {
    const { token } = useAuthStore();
    const theme = useThemeStore((state) => state.theme);
    const isDark = theme === "dark";
    const [quantity, setQuantity] = useState(1);

    const {
        data: productData,
        isLoading: productLoading,
        error: productError,
        refetch: refetchProduct,
    } = useQuery<Product>({
        queryKey: ["product", route.params.productId],
        queryFn: () => {
            if (!token?.data?.accessToken) {
                return Promise.reject(new Error("No access token"));
            }
            return GetProductApi(token.data.accessToken, route.params.productId);
        },
        enabled: !!token?.data?.accessToken && !!route.params.productId,
        retry: 3,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    const {
        data: userData,
        isLoading: userLoading,
        error: userError,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: () => {
            if (!token?.data?.accessToken) {
                return Promise.reject(new Error("No access token"));
            }
            return retry(() => GetProfileApi({ accessToken: token.data.accessToken }), 3, 1000);
        },
        enabled: !!token?.data?.accessToken,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });


    useFocusEffect(
        useCallback(() => {
            refetchProduct();
        }, [refetchProduct, token?.data?.accessToken])
    );

    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const isOwner = userData?.data?.user?.id && productData?.user?._id && userData.data?.user?.id === productData.user._id;

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

    if (productLoading || userLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
                <Text style={{ color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color, textAlign: "center", marginTop: 20 }}>
                    Loading product details...
                </Text>
            </SafeAreaView>
        );
    }

    if (!productError) {
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
            <Text style={{ color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color, textAlign: "center", marginTop: 20 }}>
                No Product to Show
            </Text>
        </SafeAreaView>
    }

    const addToCart = () => {
        if (!productData) return;

        useCartStore.getState().addToCart({
            id: productData._id,
            title: productData.title,
            price: productData.price,
            quantity,
            image: `${API_BASE_URL}${productData?.images?.[0]?.url ?? ""}`,
        });

        Alert.alert("Added to Cart", `${quantity} item(s) added to your cart.`);
        setQuantity(1)
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: isDark
                        ? GlobalStyles.theme.darkTheme.backgroundColor
                        : GlobalStyles.theme.lightTheme.backgroundColor,
                },
            ]}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {isOwner && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("EditProduct", { productId: productData?._id })
                            }
                        >
                            <Text style={styles.editButton}>Edit Product</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeleteProduct}>
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
                                <Pressable onLongPress={() => saveImageToGallery(`${API_BASE_URL}${img.url}`)}>
                                    <Image
                                        key={index}
                                        source={{ uri: `${API_BASE_URL}${img.url}` }}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                </Pressable>
                            ))}
                        </Swiper>
                    )}

                    <Text
                        style={[
                            styles.title,
                            {
                                color: isDark
                                    ? GlobalStyles.theme.darkTheme.color
                                    : GlobalStyles.theme.lightTheme.color,
                            },
                        ]}
                    >
                        {productData?.title}
                    </Text>
                    <Text style={styles.description}>{productData?.description}</Text>
                    <Text
                        style={[
                            styles.price,
                            {
                                color: isDark
                                    ? GlobalStyles.theme.darkTheme.color
                                    : GlobalStyles.theme.lightTheme.color,
                            },
                        ]}
                    >
                        ${productData?.price?.toFixed(2)}
                    </Text>
                    <Text style={styles.stock}>In Stock</Text>

                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
                            <Text style={styles.qtyText}>−</Text>
                        </TouchableOpacity>
                        <Text
                            style={[
                                styles.qtyCount,
                                {
                                    color: isDark
                                        ? GlobalStyles.theme.darkTheme.color
                                        : GlobalStyles.theme.lightTheme.color,
                                },
                            ]}
                        >
                            {quantity}
                        </Text>
                        <TouchableOpacity style={styles.qtyButton} onPress={increaseQuantity}>
                            <Text style={styles.qtyText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mapContainer}>
                        {productData?.location && (
                            <GoogleMaps
                                latitude={productData?.location?.latitude}
                                longitude={productData?.location?.longitude}
                            />
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cartMainButton} onPress={addToCart}>
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
        </SafeAreaView>
    );
};
