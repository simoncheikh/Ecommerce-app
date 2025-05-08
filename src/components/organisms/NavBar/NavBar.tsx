import { Image, TouchableOpacity, View } from "react-native"
import { styles } from "./NavBar.styles"
import { SearchField } from "../../molecules/SearchField/SearchField"


export const NavBar = () => {
    return (
        <View style={styles.container}>
            <SearchField value={""} onChangeText={function (text: string): void {
                throw new Error("Function not implemented.")
            } } />
        </View>
    )
}