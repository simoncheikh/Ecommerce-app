import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";



const customFonts = GlobalStyles.fonts;


export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: "10%",
        paddingBottom: "10%"
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: "center",
        fontFamily: customFonts.regular.title,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
        fontFamily: customFonts.regular.normalText,

    },
    codeContainer: {
        flex: 3,
        flexDirection: "column",
        width: "90%",
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    input: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        marginTop: 10,
        fontFamily: customFonts.regular.normalText,
        textAlign: "center"
    },
    button: {
    },
    resendContainer: {
    },
    timerText: {
        color: "#888",
        fontFamily: customFonts.regular.normalText,
        fontSize: 14,
    },
    resendText: {
        fontFamily: customFonts.regular.normalText,
        fontSize: 14,
    },
    resendLink: {
        color: GlobalStyles.color.primary,
        fontFamily: customFonts.regular.normalText,
    },
    resendSmallContainer: {
        display: "flex",
        flexDirection: "row"
    }
})