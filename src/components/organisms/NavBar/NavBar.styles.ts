import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../../styles/GobalStyles";


export const styles = StyleSheet.create({
    container: {
        padding: '4%',
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white"
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        height: 40,
        width: 40,
        marginRight: 10,
    },
    searchFieldWrapper: {
        flex: 1,
        height: 40,
        justifyContent: "center",
    },

})