import React from "react";
import { Pressable } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { saveImageToGallery } from "../../../utils/SaveImageToGallery";
import { API_BASE_URL } from "../../../constants/apiConfig";
import { styles } from "../../../screens/ProductDetails/ProductDetails.styles";

export const ProductImage = ({ url }: { url: string }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handleLongPress = () => {
        scale.value = withTiming(1.1, { duration: 1000 }, () => {
            scale.value = withTiming(1, { duration: 1000 });
        });
        saveImageToGallery(`${API_BASE_URL}${url}`);
    };

    return (
        <Pressable onLongPress={handleLongPress}>
            <Animated.Image
                source={{ uri: `${API_BASE_URL}${url}` }}
                style={[styles.image, animatedStyle]}
                resizeMode="contain"
            />
        </Pressable>
    );
};
