import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../../styles/GobalStyles";

const customFonts = GlobalStyles.fonts;


export const styles = StyleSheet.create({
    input: { borderWidth: 1,fontFamily:customFonts.regular.normalText, padding: "5%", marginBottom: 8, borderRadius: 10, backgroundColor: "#f2f1f4",color:"black", borderColor: "lightgray" },
})