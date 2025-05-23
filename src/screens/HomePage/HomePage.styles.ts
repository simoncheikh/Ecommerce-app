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
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    filterOption: {
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    activeFilter: {
        backgroundColor: '#e0f7fa',
        borderColor: '#4dd0e1',
    },
    clearButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f44336',
        borderRadius: 5,
        alignItems: 'center',
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        fontWeight: 'bold',
    },
})
