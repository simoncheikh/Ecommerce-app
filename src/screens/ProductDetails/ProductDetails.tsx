import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Share,
    ScrollView,
} from "react-native";
import { styles } from "./ProductDetails.styles";
import { useEffect, useState } from "react";
import products from "../../../Products.json";
import { Product } from "./ProductDetails.type";
import { useThemeContext } from "../../store/themeContext/ThemeContext";
import { GlobalStyles } from "../../styles/GobalStyles";

export const ProductDetails = ({ route }: any) => {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';
    const [productData, setProductData] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
        const selectedProduct = products?.data?.find(
            (value) => value._id === route.params.productId
        );
        setProductData(selectedProduct ?? null);
    }, [[route.params.productId]]);

    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    if (!productData) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
            <View style={[styles.content]}>
                <Image
                    source={{ uri: productData.images[0]?.url }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={[styles.title, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>{productData.title}</Text>
                <Text style={styles.description}>{productData.description}</Text>
                <Text style={[styles.price, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>${productData.price.toFixed(2)}</Text>
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
        </SafeAreaView >
    );
};
