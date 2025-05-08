import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  stock: {
    fontSize: 14,
    color: "green",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 24,
  },
  qtyButton: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 22,
    fontWeight: "600",
  },
  qtyCount: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 12,
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: "#333",
  },
  cartMainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:GlobalStyles.color.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  iconImageSmall: {
    width: 22,
    height: 22,
    tintColor: "#fff",
  },
  cartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },
});
