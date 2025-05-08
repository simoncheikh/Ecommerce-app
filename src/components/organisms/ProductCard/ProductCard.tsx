import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { styles } from "./ProductCard.styles"
import { ProductCardProps } from "./ProductCard.type"

export const ProductCard = ({ source, title, cardWidth, onPress }: ProductCardProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, styles.elevation, { width: cardWidth }]}>
            <Image
                source={source}
                style={{ width: "100%", height: 150 }}
                resizeMode="contain"
            />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}
