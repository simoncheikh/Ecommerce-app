import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./ProductCard.styles";
import { ProductCardProps } from "./ProductCard.type";
import { useThemeStore } from "../../../store/themeStore/ThemeStore";

export const ProductCard = ({ source, title, price, cardWidth, onPress }: ProductCardProps) => {
    const theme = useThemeStore((state) => state.theme);
    const isDark = theme === 'dark';

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
