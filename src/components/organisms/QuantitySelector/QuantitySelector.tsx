import React from "react";
import { View, Pressable, Text } from "react-native";
import { styles } from "../../../screens/ProductDetails/ProductDetails.styles"; 
import { GlobalStyles } from "../../../styles/GobalStyles";

type Props = {
    quantity: number;
    increase: () => void;
    decrease: () => void;
    isDark: boolean;
};

export const QuantitySelector = React.memo(({ quantity, increase, decrease, isDark }: Props) => {
    return (
        <View style={styles.quantityContainer}>
            <Pressable style={styles.qtyButton} onPress={decrease}>
                <Text style={styles.qtyText}>−</Text>
            </Pressable>
            <Text style={[styles.qtyCount, { color: isDark ? GlobalStyles.theme.darkTheme.color : GlobalStyles.theme.lightTheme.color }]}>
                {quantity}
            </Text>
            <Pressable style={styles.qtyButton} onPress={increase}>
                <Text style={styles.qtyText}>+</Text>
            </Pressable>
        </View>
    );
});
