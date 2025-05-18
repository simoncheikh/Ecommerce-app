import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { ProductCard } from "../../components/organisms/ProductCard/ProductCard"
import products from '../../../Products.json'
import { styles } from "./HomePage.styles"
import { Dimensions } from "react-native"
import { NavBar } from "../../components/organisms/NavBar/NavBar"
import { useThemeContext } from "../../store/themeContext/ThemeContext"
import { GlobalStyles } from "../../styles/GobalStyles"
import { useCallback, useEffect, useState } from "react"
import { getAllProductsApi } from "../../api/products/getAllProducts/getAllProductsApi"
import { useAuthStore } from "../../store/sessionStore/AuthStore"
import { API_BASE_URL } from "../../constants/apiConfig"
import { Button } from "../../components/atoms/Button/Button"


const screenWidth = Dimensions.get("window").width

export const HomePage = ({ navigation }: any) => {
    const { token } = useAuthStore()
    const { theme } = useThemeContext();
    const [productData, setProductData] = useState([])

    const isDark = theme === 'dark';


    const getAllProducts = useCallback(async () => {
        if (!token) {
            console.warn("No token found. Skipping API call.");
            return;
        }

        const response = await getAllProductsApi(token?.data?.accessToken);
        if (response) {
            setProductData(response);
        } else {
            console.log("No Product to show");
        }
    }, [token]);


    useEffect(() => {
        getAllProducts()
    }, [getAllProducts])


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? GlobalStyles.theme.darkTheme.backgroundColor : GlobalStyles.theme.lightTheme.backgroundColor }]}>
            <NavBar />
            <Button
                label="Refresh"
                onClick={getAllProducts}
                variant="primary"
                disabled={false}
            />

            <View style={styles.productContainer}>
                <View style={styles.filterContainer}>
                    <Text style={{ color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }}>
                        {products?.data?.length} items
                    </Text>

                    <TouchableOpacity>
                        <Text style={{ color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }}>Filter</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={productData?.data}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <ProductCard
                            title={item.title}
                            price={item.price}
                            source={{ uri: `${API_BASE_URL}${item?.images[0]?.url}` }}
                            cardWidth={screenWidth / 2 - 10}
                            onPress={() => { navigation.navigate("ProductDetails", { productId: item._id }), console.log(`${API_BASE_URL}${item?.images[0]?.url}`) }}
                        />
                    )}
                    contentContainerStyle={styles.productCard}
                />
            </View>
        </SafeAreaView>
    )
}
