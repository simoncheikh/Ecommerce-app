import React, { memo } from "react";
import { Pressable } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { saveImageToGallery } from "../../../utils/SaveImageToGallery";
import Config from "react-native-config";
import { styles } from "../../../screens/ProductDetails/ProductDetails.styles";

export const ProductImage = memo(({ url }: { url: string }) => {
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
        saveImageToGallery(`${Config.REACT_APP_API_URL}${url}`);
    };

    return (
        <Pressable onLongPress={handleLongPress}>
            <Animated.Image
                source={{ uri: `${Config.REACT_APP_API_URL}${url}` }}
                style={[styles.image, animatedStyle]}
                resizeMode="contain"
            />
        </Pressable>
    );
});
