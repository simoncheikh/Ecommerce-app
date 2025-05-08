import { Text, TouchableOpacity } from "react-native"
import { styles } from "./Button.styles"
import { ButtonProps } from "./Button.type"



export const Button = ({ onClick, label, disabled, variant }: ButtonProps) => {

    const getBackgroundColor = () => {
        if (disabled) return "gray";
        if (variant === "primary") return "#e99e5b";
        if (variant === "secondary") return "white";
        return "#e99e5b";
    };


    return (
        <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: getBackgroundColor() }]} onPress={onClick} disabled={disabled}>
            <Text style={[styles.btnLabel, { color: variant == "primary" ? "white" : disabled == true ? "white" : "#e99e5b" }]}>{label}</Text>
        </TouchableOpacity >
    )
}