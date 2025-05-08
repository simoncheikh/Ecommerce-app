import { Text, TouchableOpacity } from "react-native";
import { styles } from "./LoginButton.styles";
import { LoginButtonProps } from "./LoginButton.type";

export const LoginButton = ({ onClick, label, disabled, variant = "blue" }: LoginButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled) return "gray";
    if (variant === "red") return "#cf2d48";
    if (variant === "blue") return "#3f66b2";
    return "#e99e5b"; 
  };

  return (
    <TouchableOpacity
      style={[styles.signUpBtn, { backgroundColor: getBackgroundColor() }]}
      onPress={onClick}
      disabled={disabled}
    >
      <Text style={styles.btnLabel}>{label}</Text>
    </TouchableOpacity>
  );
};
