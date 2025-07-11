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
import { GetAllProductsApi } from "../../api/products/getAllProducts/getAllProductsApi";
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
import crashlytics from '@react-native-firebase/crashlytics';


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
    try {
      if (route.params?.productId) {
        const { productId } = route.params;
        navigation.setParams({ productId: undefined });
        navigation.navigate('ProductDetails', { productId });
      }
    } catch (error: any) {
      crashlytics().recordError(error);
      console.error("Navigation to ProductDetails failed", error);
    }
  }, [route.params?.productId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchAll,
    isFetching: isFetchingAll,
    isLoading: isLoadingAll,
  } = useInfiniteQuery({
    queryKey: ["allProducts", priceFilter, token?.data?.accessToken],
    queryFn: async ({ pageParam = 1 }) => {
      if (!token?.data?.accessToken) return { products: [], nextPage: undefined };

      const sortOrder = priceFilter === "low" ? "asc" : priceFilter === "high" ? "desc" : "desc";

      const response = await GetAllProductsApi(
        token.data.accessToken,
        pageParam,
        10,
        undefined,
        undefined,
        priceFilter ? "price" : undefined,
        sortOrder
      );

      return {
        products: response.data,
        nextPage: response.pagination?.hasNextPage ? pageParam + 1 : undefined,
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
      try {
        if (!debouncedSearchQuery.trim() || !token?.data?.accessToken) return [];
        return await SearchProductApi({
          name: debouncedSearchQuery.trim(),
          accessToken: token.data.accessToken,
        });
      } catch (error: any) {
        crashlytics().log("SearchProductApi failed");
        crashlytics().recordError(error);
        return [];
      }
    },

    enabled: !!debouncedSearchQuery.trim() && !!token?.data?.accessToken,
    staleTime: 1000 * 60 * 5,
  });

  const productsToShow = useMemo(() => {
    return debouncedSearchQuery.trim() ? searchResults : allProducts;
  }, [debouncedSearchQuery, searchResults, allProducts]);


const onRefresh = useCallback(async () => {
  try {
    setRefreshing(true);
    if (debouncedSearchQuery.trim()) {
      await refetchSearch();
    } else {
      await queryClient.removeQueries({
        queryKey: ["allProducts", priceFilter, token?.data?.accessToken],
      });
    }
  } catch (error: any) {
    console.error("❌ Error during pull-to-refresh:", error);
    crashlytics().recordError(error);
  } finally {
    setRefreshing(false);
    console.log("✅ Pull-to-refresh finished");
  }
}, [debouncedSearchQuery, refetchSearch, token?.data?.refreshToken]);



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
    crashlytics().log("Access token missing on HomePage screen");

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

  const dataWithLoadingPlaceholders = useMemo(() => {
    if (isLoadingAll || isFetchingAll || isFetchingNextPage || isSearching) {
      if (productsToShow.length > 0) {
        return [...productsToShow, ...Array(!isSearching ? null : productsToShow).fill(null)];
      }
      return Array(10).fill(null);
    }
    return productsToShow;
  }, [productsToShow, isLoadingAll, isFetchingAll, isFetchingNextPage, isSearching]);

  const isAnyLoading = isLoadingAll || isFetchingAll || isFetchingNextPage || isSearching;

  console.log(refreshing)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <NavBar refetch={refetchAll} />

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
                <Text style={{ color: textColor }}>Price: Low to High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, priceFilter === "high" && styles.activeFilter]}
                onPress={() => applyPriceFilter("high")}
              >
                <Text style={{ color: textColor }}>Price: High to Low</Text>
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
          data={dataWithLoadingPlaceholders}
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
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={styles.productCard}
          ListEmptyComponent={
            !isAnyLoading && productsToShow.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20, color: textColor }}>
                No products found.
              </Text>
            ) : null
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage && !isSearching) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    </SafeAreaView>
  );
};