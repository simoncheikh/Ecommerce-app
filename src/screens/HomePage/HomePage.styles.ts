import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    },
    productContainer: {
        alignItems: "center",
        flex: 1
    },
    productCard: {
        paddingBottom: 10,
        gap: 20
    },
    filterContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: "4%"
    },
})
