import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";


const customFonts = GlobalStyles.fonts;


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    mainTitle: {
        fontFamily: customFonts.regular.normalText
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
        marginBottom: 20,
    },
    mapContainer: {
        height: 200,
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 16,
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
    profileImageContainer: {
        position: "relative",
    },
    profileImages: {
        width: 100, height: 100, borderRadius: 8
    },
    removeImage: {
        position: "absolute", top: -8, right: -8
    },
    removeText: {
        backgroundColor: "red",
        color: "white",
        padding: 4,
        borderRadius: 12
    },
    changeProfileImage: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 4,
        borderRadius: 4,
        marginTop: 4
    },
    addProfileImage: {
        width: 100,
        height: 100,
        backgroundColor: "#eee",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.2, elevation: 1
    },
    addText: {
        fontSize: 24
    },
    ImagesContainer: {
        flexDirection: "row", gap: 10
    },
    changeText: {
        fontSize: 12,
        color: "white",
        textAlign: "center"
    }
})