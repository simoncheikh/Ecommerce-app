import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../../styles/GobalStyles";


export const styles = StyleSheet.create({
    container: {
        padding: '4%',
        paddingBottom: "2%",
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: GlobalStyles.color.primary
    },
    searchFieldContainer: {
        width: "70%"
    },
    themeContainer: {
        width: "15%",
        alignItems: "flex-end"
    },
    switch: {
        marginHorizontal: 10,
    }

})