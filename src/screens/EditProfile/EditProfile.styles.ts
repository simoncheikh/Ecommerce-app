import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";


const customFonts = GlobalStyles.fonts;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },

    profileSection: {
        alignItems: "center",
        paddingVertical: 20,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 16,
        backgroundColor: "#eee",
    },
    error: {
        color: "red",
        fontFamily: customFonts.regular.normalText,
        marginBottom: 8
    },
    fieldsContainer: {
        display: "flex",
        gap: "2%",
        flexDirection: "column",
    },
    imageWrapper: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },

    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 10,
        borderRadius: 20,
        padding: 6,
    },

    formCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        marginHorizontal: 20,
        marginTop: 16,
        elevation: 5,
    },

    inputGroup: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        color: "#555",
        marginBottom: 6,
    },

    buttonWrapper: {
        marginTop: 20,
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    modalCancel: {
        paddingVertical: 16,
        marginTop: 8,
    },
    modalCancelText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'red',
    },

})