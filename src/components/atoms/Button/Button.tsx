import { Text, TouchableOpacity } from "react-native"
import { styles } from "./Button.styles"
import { ButtonProps } from "./Button.type"
import { memo } from "react"; 

export const Button = memo(({ onClick, label, disabled, variant }: ButtonProps) => {

    const getBackgroundColor = () => {
        if (disabled) return "gray";
        if (variant === "primary") return "#e99e5b";
        if (variant === "secondary") return "white";
        return "#e99e5b"; 
    };

    const getTextColor = () => {
        if (variant === "primary") return "white";
        if (disabled) return "white"; 
        return "#e99e5b"; 
    };

    return (
        <TouchableOpacity
            style={[styles.signUpBtn, { backgroundColor: getBackgroundColor() }]}
            onPress={onClick}
            disabled={disabled}
            testID="button"
        >
            <Text
                style={[
                    styles.btnLabel,
                    { color: getTextColor() } 
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity >
    )
})