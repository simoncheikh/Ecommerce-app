import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";


const primaryColor = GlobalStyles.color.primary


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 8,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: primaryColor,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    details: {
        marginLeft: 12,
        justifyContent: 'space-between',
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    price: {
        fontSize: 14,
        color: 'gray',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    qtyBtn: {
        backgroundColor: 'white',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityText: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderRadius: 10,
        width: '30%',
        height: '88%'
    },
    deleteButtonImage: {
        width: 30,
        height: 30
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
    },
    totalContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 16,
        marginTop: 8,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        color: GlobalStyles.theme.lightTheme.color,
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    cartHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 16,
        color: GlobalStyles.theme.lightTheme.color,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#888',
    },
})