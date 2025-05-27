import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../../styles/GobalStyles";

export const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        position: "relative",
        alignSelf:'center'
    },
    favoriteContainer: {
        zIndex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 6,
        alignItems: "center"
    },
    heartIcon: {
        width: 20,
        height: 20,
        tintColor: "#f44",
    },
    productImage: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 6,
    },
    price: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
        color: GlobalStyles.color.primary,
    },
    skeletonContainer: {
        padding: 12,
        backgroundColor:'white'
    },
});
