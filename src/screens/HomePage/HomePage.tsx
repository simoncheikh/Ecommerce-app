import React, { useState, useEffect } from "react";
import {
    FlatList,
    SafeAreaView,
    Text,
    View,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    Modal,
} from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { GetAllProductsApi } from "../../api/products/getAllProducts/GetAllProductsApi";
import { SearchProductApi } from "../../api/products/searchProduct/SearchProductApi";
import { useAuthStore } from "../../store/sessionStore/AuthStore";
import { useThemeStore } from "../../store/themeStore/ThemeStore";
import { useSearchStore } from "../../store/searchStore/searchStore";
import { ProductCard } from "../../components/organisms/ProductCard/ProductCard";
import { styles } from "./HomePage.styles";
import { GlobalStyles } from "../../styles/GobalStyles";
import { useQueryClient } from "@tanstack/react-query";
import { NavBar } from "../../components/organisms/NavBar/NavBar";
import { API_BASE_URL } from "../../constants/apiConfig";

const screenWidth = Dimensions.get("window").width;

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export const HomePage = ({ navigation }: any) => {
    const { token } = useAuthStore();
    const theme = useThemeStore((state) => state.theme);
    const { query } = useSearchStore();

    const isDark = theme === "dark";
    const queryClient = useQueryClient();

    const [priceFilter, setPriceFilter] = useState<"low" | "high" | null>(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const debouncedSearchQuery = useDebounce(query, 500);


    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: refetchAll,
        isFetching: isFetchingAll,
    } = useInfiniteQuery({
        queryKey: ["allProducts", priceFilter, token?.data?.accessToken],
        queryFn: async ({ pageParam = 1 }) => {
            if (!token?.data?.accessToken) return { products: [], nextPage: undefined };
            const response = await GetAllProductsApi(token.data.accessToken, pageParam, 10);
            let products = response.data;

            if (priceFilter) {
                products = products.sort((a, b) =>
                    priceFilter === "low" ? a.price - b.price : b.price - a.price
                );
            }

            return {
                products,
                nextPage: response.pagination.hasNextPage ? pageParam + 1 : undefined,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        enabled: !!token?.data?.accessToken,
        staleTime: 1000 * 60 * 5,
    });


    const allProducts = data?.pages.flatMap(page => page.products) ?? [];



    const {
        data: searchResults = [],
        refetch: refetchSearch,
        isFetching: isSearching,
    } = useQuery({
        queryKey: ["searchProducts", debouncedSearchQuery, token?.data?.accessToken],
        queryFn: async () => {
            if (!debouncedSearchQuery.trim() || !token?.data?.accessToken) return [];
            return await SearchProductApi({
                name: debouncedSearchQuery.trim(),
                accessToken: token.data.accessToken,
            });
        },
        enabled: !!debouncedSearchQuery.trim() && !!token?.data?.accessToken,
        staleTime: 1000 * 60 * 5,
    });

    const onRefresh = async () => {
        setRefreshing(true);

        if (debouncedSearchQuery.trim()) {
            await refetchSearch();
        } else {
            // Clear cache for infinite query to force restart from page 1
            await queryClient.removeQueries({ queryKey: ["allProducts"] });
        }

        setRefreshing(false);
    };


    const clearFilters = () => {
        setPriceFilter(null);
        setShowFilterModal(false);
        refetchAll();
    };

    const applyPriceFilter = (filter: "low" | "high" | null) => {
        setPriceFilter(filter);
        setShowFilterModal(false);
        refetchAll();
    };

    const productsToShow = debouncedSearchQuery.trim() ? searchResults : allProducts;

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
                        {productsToShow.length} items
                    </Text>

                    <TouchableOpacity
                        onPress={() => setShowFilterModal(true)}
                        style={styles.filterButton}
                    >
                        <Text
                            style={{
                                color: isDark
                                    ? GlobalStyles.theme.darkTheme.color
                                    : GlobalStyles.theme.lightTheme.color,
                            }}
                        >
                            Filter
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showFilterModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowFilterModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor: isDark
                                        ? GlobalStyles.theme.darkTheme.backgroundColor
                                        : GlobalStyles.theme.lightTheme.backgroundColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.modalTitle,
                                    {
                                        color: isDark
                                            ? GlobalStyles.theme.darkTheme.color
                                            : GlobalStyles.theme.lightTheme.color,
                                    },
                                ]}
                            >
                                Filter by Price
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.filterOption,
                                    priceFilter === "low" && styles.activeFilter,
                                ]}
                                onPress={() => applyPriceFilter("low")}
                            >
                                <Text>Price: Low to High</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.filterOption,
                                    priceFilter === "high" && styles.activeFilter,
                                ]}
                                onPress={() => applyPriceFilter("high")}
                            >
                                <Text>Price: High to Low</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                                <Text style={styles.clearButtonText}>Clear Filters</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowFilterModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <FlatList
                    data={data?.pages.flatMap((page) => page.products) || []} // 👈 Flatten all pages
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <ProductCard
                            title={item.title}
                            price={item.price}
                            source={{
                                uri: `${API_BASE_URL}${item?.images?.[0]?.url ?? ""}`,
                            }}
                            cardWidth={screenWidth - 50}
                            onPress={() =>
                                navigation.navigate("ProductDetails", { productId: item._id })
                            }
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing || isFetchingAll || isSearching}
                            onRefresh={onRefresh}
                        />
                    }
                    contentContainerStyle={styles.productCard}
                    ListEmptyComponent={
                        !isFetchingAll && !isSearching ? (
                            <Text
                                style={{
                                    textAlign: "center",
                                    marginTop: 20,
                                    color: isDark
                                        ? GlobalStyles.theme.darkTheme.color
                                        : GlobalStyles.theme.lightTheme.color,
                                }}
                            >
                                No products found.
                            </Text>
                        ) : null
                    }
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <Text
                                style={{
                                    textAlign: "center",
                                    marginVertical: 10,
                                    color: isDark
                                        ? GlobalStyles.theme.darkTheme.color
                                        : GlobalStyles.theme.lightTheme.color,
                                }}
                            >
                                Loading more...
                            </Text>
                        ) : null
                    }
                />

            </View>
        </SafeAreaView>
    );
};
