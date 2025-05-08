import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { ProductCard } from "../../components/organisms/ProductCard/ProductCard"
import products from '../../../Products.json'
import { styles } from "./HomePage.styles"
import { Dimensions } from "react-native"
import { NavBar } from "../../components/organisms/NavBar/NavBar"
import { useNavigation } from "@react-navigation/native"


const screenWidth = Dimensions.get("window").width

export const HomePage = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <NavBar />
            <View style={styles.productContainer}>
                <View style={styles.filterContainer}>
                    <Text style={styles.totalLabel}>
                        {products?.data?.length} items
                    </Text>

                    <View>
                        <TouchableOpacity>
                            <Text>Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={products.data}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <ProductCard
                            title={item.title}
                            source={{ uri: item?.images[0]?.url }}
                            cardWidth={screenWidth / 2}
                            onPress={() => navigation.navigate("ProductDetails", { productId: item._id })}
                        />
                    )}
                    contentContainerStyle={styles.productCard}
                />
            </View>
        </SafeAreaView>
    )
}
