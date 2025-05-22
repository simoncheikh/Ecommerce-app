import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    editButton: {
        fontSize: 16,
        color: "#007bff",
        fontWeight: "600",
    },
    profileSection: {
        alignItems: "center",
        paddingVertical: 20,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 16,
        backgroundColor: "#eee",
    },
    name: {
        fontSize: 24,
        fontWeight: "600",
        color: "#222",
    },
    email: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
    },
    verified: {
        fontSize: 14,
        marginTop: 8,
        color: "#2e7d32",
        fontWeight: "500",
    },
    joinedAt: {
        fontSize: 13,
        color: "#999",
        marginTop: 12,
    },
    addProductButton: {
        marginTop: 30,
        backgroundColor: "#007bff",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    addProductText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    actionButton: {
        marginTop: 32,
        paddingHorizontal: 10,
    },

});
