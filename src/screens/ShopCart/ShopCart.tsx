import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import { styles } from './ShopCart.style';
import { Product } from "./ShopCart.type";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useCartStore } from "../../store/cartStore/cartStore";
import { Animated } from 'react-native';
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { SafeAreaView } from "react-native-safe-area-context";


export const ShopCart = () => {
    const { items: products, removeFromCart, updateQuantity } = useCartStore();
    const token = useAuthStore((state) => state.token);
    const isLoggedIn = !!token;
    const primaryColor = GlobalStyles.color.primary;

    const renderRightActions = (progress: any, dragX: any, id: string) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });

        return (
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeFromCart(id)}
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

    const renderItem = ({ item }: { item: Product }) => (
        <Swipeable
            renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, item.id)
            }
            rightThreshold={40}
        >
            <View style={styles.card}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.details}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, -1)}
                            style={styles.qtyBtn}
                        >
                            <Image
                                source={require('../../assets/minus.png')}
                                style={{ tintColor: primaryColor, width: 20, height: 20 }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, 1)}
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
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
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