import {
    FlatList,
    SafeAreaView,
    Text,
    View,
    Dimensions,
    RefreshControl,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "../../components/organisms/ProductCard/ProductCard";
import { styles } from "./HomePage.styles";
import { NavBar } from "../../components/organisms/NavBar/NavBar";
import { useThemeContext } from "../../store/themeContext/ThemeContext";
import { GlobalStyles } from "../../styles/GobalStyles";
import { getAllProductsApi } from "../../api/products/getAllProducts/GetAllProductsApi";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { API_BASE_URL } from "../../constants/apiConfig";
import { Product } from "../ProductDetails/ProductDetails.type";
import { retry } from "../../utils/retry";
import { Debounce } from "../../utils/Debounce";
import { SearchProductApi } from "../../api/products/searchProduct/SearchProductApi";
import { useSearchStore } from "../../store/searchStore/searchStore";

const screenWidth = Dimensions.get("window").width;

export const HomePage = ({ navigation }: any) => {
    const { token } = useAuthStore();
    const { theme } = useThemeContext();
    const { query } = useSearchStore();

    const [productData, setProductData] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchProduct, setSearchProduct] = useState<any>([])

    const isDark = theme === "dark";

    const getProducts = useCallback(
        async (reset = false) => {
            if (!token?.data?.accessToken) return;

            const currentPage = reset ? 1 : page;

            try {
                const response = await retry(
                    () => getAllProductsApi(token.data.accessToken, currentPage, 10),
                    3,
                    100
                );
                if (response?.data) {
                    if (reset) {
                        setProductData(response.data);
                    } else {
                        setProductData((prev) => [...prev, ...response.data]);
                    }

                    setPage(currentPage + 1);
                    setHasNextPage(response.pagination?.hasNextPage ?? false);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        [token, page]
    );

    useEffect(() => {
        if (token?.data?.accessToken) {
            getProducts(true);
        }
    }, [token]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await getProducts(true);
        setPage(2);
        setRefreshing(false);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !refreshing && !isSearching) {
            console.log("Loading more products...");
            getProducts();
        }
    };

    const debouncedSearchRef = useRef(
        Debounce(async (searchQuery: string) => {
            const trimmed = searchQuery.trim();

            if (!trimmed) {
                setSearchProduct([]);
                await getProducts(true);
                setIsSearching(false);
                return;
            }

            try {
                setIsSearching(true);
                setSearchProduct([]);
                const results = await SearchProductApi({
                    name: trimmed,
                    accessToken: token?.data.accessToken,
                });
                setSearchProduct(results);
                setHasNextPage(false);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500)
    );


    useEffect(() => {
        if (query !== undefined && token?.data?.accessToken) {
            debouncedSearchRef.current(query);
        }
    }, [query]);

    useEffect(() => {
        return () => {
            debouncedSearchRef.current = () => { };
        };
    }, []);

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
            <NavBar />

            <View style={styles.productContainer}>
                <View style={styles.filterContainer}>
                    <Text
                        style={{
                            color: isDark
                                ? GlobalStyles.theme.darkTheme.color
                                : GlobalStyles.theme.lightTheme.color,
                        }}
                    >
                        {Array.isArray(productData) ? productData.length : 0} items
                    </Text>

                </View>

                <FlatList
                    data={isSearching || query.trim() ? searchProduct : productData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        return (
                            <ProductCard
                                title={item.title}
                                price={item.price}
                                source={{
                                    uri: `${API_BASE_URL}${item?.images?.[0]?.url ?? ""}`,
                                }}
                                cardWidth={screenWidth - 50}
                                onPress={() =>
                                    navigation.navigate("ProductDetails", {
                                        productId: item._id,
                                    })
                                }
                            />
                        );
                    }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.2}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                    contentContainerStyle={styles.productCard}
                />
            </View>
        </SafeAreaView>
    );
};
