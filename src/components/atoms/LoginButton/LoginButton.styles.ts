import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../../styles/GobalStyles";

const customFonts = GlobalStyles.fonts;


export const styles = StyleSheet.create({
    signUpBtn: {
        padding: "3%",
        backgroundColor: GlobalStyles.color.primary,
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        width: "49%"
    },
    btnLabel: {
        color: "white",
        fontSize: 20,
        fontFamily:customFonts.regular.normalText
    },
})
