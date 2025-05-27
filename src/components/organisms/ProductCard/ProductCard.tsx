import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./ProductCard.styles";
import { ProductCardProps } from "./ProductCard.type";
import { useThemeStore } from "../../../store/themeStore/ThemeStore";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { GlobalStyles } from "../../../styles/GobalStyles";

export const ProductCard = ({ source, title, price, cardWidth, onPress, loading = false }: ProductCardProps & { loading?: boolean }) => {
    const theme = useThemeStore((state) => state.theme);
    const isDark = theme === 'dark';

    if (loading) {
        return (
            <View
                style={{
                    width: '80%',
                    padding: 10,
                    borderRadius: 8,
                    alignSelf: 'center'
                }}
            >
                <SkeletonPlaceholder
                    backgroundColor={"#f2fbfc"}
                    highlightColor={"#e0f7fa"}

                >
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
                        <SkeletonPlaceholder.Item marginLeft={20}>
                            <SkeletonPlaceholder.Item width={120} height={20} />
                            <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>
        );
    }


    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                { width: cardWidth, backgroundColor: isDark ? "#2c2c2e" : "#fff" }
            ]}
        >
            <Image
                source={source}
                style={styles.productImage}
                resizeMode="contain"
            />
            <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
                {title}
            </Text>
            <Text style={styles.price}>${price}</Text>
        </TouchableOpacity>
    );
};