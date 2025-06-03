import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FlatList,
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
import Config from "react-native-config";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const HomePage = ({ navigation, route }: any) => {
  const theme = useThemeStore((state) => state.theme);
  const { query } = useSearchStore();
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = !!token;
  const isDark = theme === "dark";
  const queryClient = useQueryClient();

  const [priceFilter, setPriceFilter] = useState<"low" | "high" | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const debouncedSearchQuery = useDebounce(query, 500);

  useEffect(() => {
    if (route.params?.productId) {
      const { productId } = route.params;
      navigation.setParams({ productId: undefined });
      navigation.navigate('ProductDetails', { productId });
    }
  }, [route.params?.productId]);

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

  const productsToShow = useMemo(() => {
    return debouncedSearchQuery.trim() ? searchResults : allProducts;
  }, [debouncedSearchQuery, searchResults, allProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (debouncedSearchQuery.trim()) {
      await refetchSearch();
    } else {
      await queryClient.removeQueries({ queryKey: ["allProducts"] });
    }
    setRefreshing(false);
  }, [debouncedSearchQuery, refetchSearch, queryClient]);

  const applyPriceFilter = (filter: "low" | "high" | null) => {
    setPriceFilter(filter);
    setShowFilterModal(false);
    refetchAll();
  };

  const clearFilters = () => {
    setPriceFilter(null);
    setShowFilterModal(false);
    refetchAll();
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate("ProductDetails", { productId });
  };

  if (!isLoggedIn || !token?.data?.accessToken) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "red", fontSize: 16 }}>You must be logged in to view products.</Text>
      </SafeAreaView>
    );
  }

  const backgroundColor = isDark 
    ? GlobalStyles.theme.darkTheme.backgroundColor 
    : GlobalStyles.theme.lightTheme.backgroundColor;
  
  const textColor = isDark
    ? GlobalStyles.theme.darkTheme.color
    : GlobalStyles.theme.lightTheme.color;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <NavBar />

      <View style={styles.productContainer}>
        <View style={styles.filterContainer}>
          <Text style={{ color: textColor }}>{productsToShow.length} items</Text>
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={styles.filterButton}
          >
            <Text style={{ color: textColor }}>Filter</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Filter by Price
              </Text>
              <TouchableOpacity
                style={[styles.filterOption, priceFilter === "low" && styles.activeFilter]}
                onPress={() => applyPriceFilter("low")}
              >
                <Text>Price: Low to High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, priceFilter === "high" && styles.activeFilter]}
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
          data={isFetchingAll || isSearching ? Array(5).fill(null) : productsToShow}
          keyExtractor={(item, index) => item?._id ?? `skeleton-${index}`}
          renderItem={({ item }) => (
            <ProductCard
              title={item?.title}
              price={item?.price}
              source={item ? { uri: `${Config.REACT_APP_API_URL}${item?.images?.[0]?.url ?? ""}` } : undefined}
              cardWidth={screenWidth - 50}
              onPress={() => item && handleProductPress(item._id)}
              loading={!item}
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
              <Text style={{ textAlign: "center", marginTop: 20, color: textColor }}>
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
        />
      </View>
    </SafeAreaView>
  );
};