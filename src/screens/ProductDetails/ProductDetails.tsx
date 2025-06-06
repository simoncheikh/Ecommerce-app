import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    Pressable,
    Share,
    Linking,
    Platform,
} from "react-native";
import { styles } from "./ProductDetails.styles";
import { useCallback, useEffect, useState } from "react";
import { Product } from "./ProductDetails.type";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { GetProductApi } from "../../api/products/getProductById/GetProductApi";
import Config from "react-native-config";
import { GoogleMaps } from "../../components/organisms/Maps/googleMaps";
import Swiper from "react-native-swiper";
import { GetProfileApi } from "../../api/users/profile/getprofile/GetProfileApi";
import { retry } from "../../utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteProductApi } from "../../api/products/deleteProduct/DeleteProductApi";
import { useFocusEffect } from "@react-navigation/native";
import { useCartStore } from "../../store/cartStore/cartStore";
import { ProductImage } from "../../components/organisms/ProductImages/ProductImage";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SafeAreaView } from "react-native-safe-area-context";
import crashlytics from '@react-native-firebase/crashlytics';
import { QuantitySelector } from "../../components/organisms/QuantitySelector/QuantitySelector";




export const ProductDetails = ({ route, navigation }: any) => {
    const theme = useThemeStore((state) => state.theme);
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    const isLoggedIn = !!token;
    const isDark = theme === "dark";
    const [quantity, setQuantity] = useState(1);

    const productId = route.params?.productId;

    useEffect(() => {
        if (!productId) {
            crashlytics().log("ProductDetails: Missing productId in route params");
            navigation.goBack();
        }
    }, [productId]);

    const {
        data: productData,
        isLoading: productLoading,
        error: productError,
        refetch: refetchProduct,
    } = useQuery<Product>({
        queryKey: ["product", route.params.productId],
        queryFn: () => {
            if (!token?.data?.accessToken) {
                const error = new Error("No access token for GetProductApi");
                crashlytics().recordError(error);
                return Promise.reject(new Error("No access token"));
            }
            return retry(() => GetProductApi(token.data.accessToken, route.params.productId));
        },
        enabled: !!token?.data?.accessToken && !!route.params.productId,
        retry: 3,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {
        data: userData,
        isLoading: userLoading,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: () => {
            if (!token?.data?.accessToken) {
                const error = new Error("No access token for GetProfileApi");
                crashlytics().recordError(error);
                return Promise.reject(error);
            }
            return retry(() => GetProfileApi({ accessToken: token.data.accessToken }), 3, 1000);
        },
        enabled: !!token?.data?.accessToken,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    useFocusEffect(
        useCallback(() => {
            if (productId && token?.data?.accessToken) {
                refetchProduct();
            }
        }, [refetchProduct, productId, token?.data?.accessToken])
    );

    const increaseQuantity = useCallback(() => {
        setQuantity((prev) => prev + 1);
    }, []);

    const decreaseQuantity = useCallback(() => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }, []);

    const isOwner =
        userData?.data?.user?.id &&
        productData?.user?._id &&
        userData.data?.user?.id === productData.user._id;

    const deleteProductMutation = useMutation({
        mutationFn: ({ id, accessToken }: { id: string; accessToken: string }) =>
            DeleteProductApi({ id, accessToken }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allProducts"] })
            Alert.alert("Success", "Product deleted successfully");
            navigation.goBack();
        },
        onError: (error: any) => {
            crashlytics().recordError(error);
            if (error.message.includes("401")) {
                Alert.alert("Session Expired", "Please log in again.");
            } else {
                Alert.alert("Error", error.message || "Failed to delete product");
            }
        },
    });

    const handleDeleteProduct = useCallback(() => {
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
    }, [deleteProductMutation, productData, token]);

    const addToCart = useCallback((qty: number) => {
        if (!productData) return;

        useCartStore.getState().addToCart({
            id: productData._id,
            title: productData.title,
            price: productData.price,
            quantity: qty,
            image: `${Config.REACT_APP_API_URL}${productData?.images?.[0]?.url ?? ""}`,
        });

        Alert.alert("Added to Cart", `${qty} item(s) added to your cart.`);
        setQuantity(1);
    }, [productData]);

    const handleShare = useCallback(async () => {
        if (!productData?._id) {
            const error = new Error("handleShare: Product ID is missing.");
            crashlytics().recordError(error);
            Alert.alert("Error", error.message);
            return;
        }

        const deepLink = `http://myappsimonecommerce.com/product/${productData._id}`;

        try {
            await Share.share({
                message: `Check out this product: ${productData.title}\n${deepLink}`,
            });
        } catch (error: any) {
            crashlytics().recordError(error);
            Alert.alert("Error", "Failed to share the product.");
        }
    }, [productData]);

    const openGmailCompose = async (email: string) => {
        const gmailIntentUrl = `googlegmail://co?to=${email}`;
        const mailtoUrl = `mailto:${email}`;
        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

        try {
            if (Platform.OS === 'android') {
                try {
                    await Linking.openURL(gmailIntentUrl);
                    return;
                } catch (err) {
                    console.warn("Gmail app not available");
                }
            }

            try {
                await Linking.openURL(mailtoUrl);
                return;
            } catch (err) {
                console.warn("No mailto handler available");
            }

            try {
                await Linking.openURL(gmailWebUrl);
                return;
            } catch (err) {
                console.warn("Can't open Gmail web");
            }

            Alert.alert(
                "No Email App Found",
                "Please install Gmail or another email app, or open Gmail in a browser.",
                [{ text: "OK" }]
            );
        } catch (err) {
            console.error("Unexpected error opening email client", err);
            Alert.alert(
                "Error",
                "Could not open any email client.",
                [{ text: "OK" }]
            );
        }
    };

    const handleEmailPress = () => {
        if (!productData?.user?.email) {
            crashlytics().log("Attempted to send email, but no email found");
            return;
        }

        crashlytics().log(`User clicked email: ${productData?.user?.email}`);
        openGmailCompose(productData?.user?.email);
    };


    if (productLoading) {
        return (
            <SafeAreaView style={[styles.container, { width: '100%', paddingTop: "10%", elevation: 0, backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
                <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item flexDirection="column" alignItems="center" padding={10} gap={10} width={"100%"}>
                        <SkeletonPlaceholder.Item width={300} height={100} borderRadius={5} />
                        <SkeletonPlaceholder.Item marginLeft={20} width={300}>
                            <SkeletonPlaceholder.Item width={280} height={20} />
                            <SkeletonPlaceholder.Item marginTop={6} width={280} height={20} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </SafeAreaView>
        );
    }
    if (!productData || productError) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
                <Text style={{ color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color, textAlign: "center", marginTop: 20 }}>
                    No Product to Show
                </Text>
            </SafeAreaView>
        );
    }

    if (!isLoggedIn || !token?.data?.accessToken) {
        crashlytics().log('Access token missing on EditProfile screen')
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view products.</Text>
            </SafeAreaView>
        );
    }


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
                <View style={styles.content}>
                    {(productData?.images?.length ?? 0) > 0 && (
                        <Swiper
                            style={styles.imageSwiper}
                            showsPagination={false}
                            autoplay={false}
                            height={300}
                            loop={false}
                        >
                            {productData?.images.map((img, index) => (
                                <ProductImage key={index} url={img.url} />
                            ))}

                        </Swiper>
                    )}

                    <Text style={[styles.title, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>
                        {productData?.title}
                    </Text>
                    <Text style={styles.description}>{productData?.description}</Text>
                    <Text style={[styles.price, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>
                        ${productData?.price?.toFixed(2)}
                    </Text>
                    <Text style={styles.stock}>In Stock</Text>
                    {/* 
                    <View style={styles.quantityContainer}>
                        <Pressable style={styles.qtyButton} onPress={decreaseQuantity}>
                            <Text style={styles.qtyText}>−</Text>
                        </Pressable>
                        <Text style={[styles.qtyCount, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>
                            {quantity}
                        </Text>
                        <Pressable style={styles.qtyButton} onPress={increaseQuantity}>
                            <Text style={styles.qtyText}>+</Text>
                        </Pressable>
                    </View> */}
                    <QuantitySelector
                        quantity={quantity}
                        increase={increaseQuantity}
                        decrease={decreaseQuantity}
                        isDark={isDark}
                    />


                    <View>
                        <Pressable onPress={handleEmailPress}>
                            <Text style={[styles.email, {
                                textDecorationLine: "underline",
                                color: isDark ? "#66b2ff" : "#0066cc",
                            }]}>
                                {productData?.user?.email}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.mapContainer}>
                        {productData?.location && (
                            <GoogleMaps
                                latitude={productData.location.latitude}
                                longitude={productData.location.longitude}
                            />
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cartMainButton} onPress={() => addToCart(quantity)}>
                            <Image
                                source={require("../../assets/cart.png")}
                                style={styles.iconImageSmall}
                            />
                            <Text style={styles.cartText}>Add {quantity} to Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
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
