import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import { styles } from './ShopCart.style';
import { Product } from "./ShopCart.type";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useCartStore } from "../../store/cartStore/cartStore";
import { Animated } from 'react-native';
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { useCallback } from "react";
import crashlytics from '@react-native-firebase/crashlytics'



export const ShopCart = () => {
    const { items: products, removeFromCart, updateQuantity } = useCartStore();
    const theme = useThemeStore((state) => state.theme);
    const token = useAuthStore((state) => state.token);
    const isLoggedIn = !!token;
    const primaryColor = GlobalStyles.color.primary;
    const isDarkMode = theme === "dark";

    const darkTheme = GlobalStyles.theme.darkTheme
    const lightTheme = GlobalStyles.theme.lightTheme


    const renderRightActions = (progress: any, dragX: any, id: string) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });




        return (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    crashlytics().log(`User swiped to delete product: ${id}`);
                    removeFromCart(id);
                }}

            >
                <Animated.Image
                    style={[
                        styles.deleteButtonImage,
                        { transform: [{ translateX: trans }] }
                    ]}
                    source={require('../../assets/delete.png')}
                    tintColor={"#fff"}
                />
            </TouchableOpacity>
        );
    };

    const increaseQuantity = (id: string) => {
        const product = products.find(item => item.id === id);
        if (product) {
            crashlytics().log(`Increasing quantity of product: ${product.title} (id: ${id})`);
            updateQuantity(id, product.quantity + 1);
        } else {
            crashlytics().recordError(new Error(`Product not found when increasing quantity: ${id}`));
        }
    };


    const decreaseQuantity = (id: string) => {
        const product = products.find(item => item.id === id);
        if (product) {
            crashlytics().log(`Decreasing quantity of product: ${product.title} (id: ${id})`);
            if (product.quantity > 1) {
                updateQuantity(id, product.quantity - 1);
            } else {
                crashlytics().log(`Prompting user to remove item with quantity 1: ${id}`);
                Alert.alert(
                    "Remove item",
                    "Are you sure you want to remove this item from your cart?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Remove", onPress: () => {
                                crashlytics().log(`User confirmed removal of product: ${id}`);
                                removeFromCart(id);
                            }
                        }
                    ]
                );
            }
        } else {
            crashlytics().recordError(new Error(`Product not found when decreasing quantity: ${id}`));
        }
    };

    if (!isLoggedIn || !token?.data?.accessToken) {
        crashlytics().log("Unauthorized access attempt to ShopCart screen");
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view products.</Text>
            </SafeAreaView>
        );
    }



    const renderItem = ({ item }: { item: Product }) => (
        <Swipeable
            renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, item.id)
            }
            rightThreshold={40}
        >
            <View style={[styles.card, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.details}>
                    <Text style={[styles.title, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>{item.title}</Text>
                    <Text style={[styles.price, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>${item.price.toFixed(2)}</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => decreaseQuantity(item.id)}
                            style={styles.qtyBtn}
                        >
                            <Image
                                source={require('../../assets/minus.png')}
                                style={{ tintColor: primaryColor, width: 20, height: 20 }}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.quantityText, { color: isDarkMode ? darkTheme.color : lightTheme.color }]}>{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => increaseQuantity(item.id)}
                            style={styles.qtyBtn}
                        >
                            <Image
                                source={require('../../assets/plus.png')}
                                style={{ tintColor: primaryColor, width: 20, height: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Swipeable>
    );

    if (!isLoggedIn || !token?.data?.accessToken) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view products.</Text>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
            <View style={[styles.container, { backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor }]}>
                {products.length > 0 ? (
                    <FlatList
                        data={products}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View style={styles.emptyCartContainer}>
                        <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};