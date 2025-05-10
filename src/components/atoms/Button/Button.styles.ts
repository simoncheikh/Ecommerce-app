import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../../styles/GobalStyles";

const customFonts = GlobalStyles.fonts;


export const styles = StyleSheet.create({
    signUpBtn: { padding: "5%", backgroundColor: GlobalStyles.color.primary, borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center" },
    btnLabel: { color: "white",fontFamily:customFonts.regular.normalText },
})