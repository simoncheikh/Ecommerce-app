import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";
import { scale, verticalScale, moderateScale } from "../../utils/Scale";

const customFonts = GlobalStyles.fonts;


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    // padding: 16,
  },
  ownerContainer: { display: 'flex', flexDirection: "row",alignItems:"center" },
  ownerText:{fontSize:16},
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    height: 'auto',
    justifyContent: "space-between"
  },
  content: {
    padding: scale(20),
    paddingBottom: verticalScale(40),
  },
  image: {
    width: "100%",
    height: verticalScale(300),
    borderRadius: scale(12),
    marginBottom: verticalScale(20),
  },
  imageSwiper: {
    marginBottom: 16,
  },
  title: {
    fontSize: moderateScale(22),
    marginBottom: verticalScale(8),
    fontFamily: customFonts.regular.title
  },
  description: {
    fontSize: moderateScale(16),
    color: "#666",
    marginBottom: verticalScale(10),
    fontFamily: customFonts.regular.normalText
  },
  price: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(6),
    fontFamily: customFonts.regular.normalText
  },
  stock: {
    fontSize: moderateScale(14),
    color: "green",
    marginBottom: verticalScale(20),
    fontFamily: customFonts.regular.normalText
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: verticalScale(24),
  },
  qtyButton: {
    width: scale(40),
    height: verticalScale(40),
    backgroundColor: "#eee",
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: moderateScale(22),
    fontWeight: "600",
  },
  qtyCount: {
    fontSize: moderateScale(18),
    fontFamily: customFonts.regular.normalText,
    marginHorizontal: scale(16),
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(16),
  },
  iconButton: {
    padding: scale(12),
    backgroundColor: "#eee",
    borderRadius: scale(12),
  },
  iconImage: {
    width: scale(24),
    height: scale(24),
    tintColor: "#333",
  },
  cartMainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.color.primary,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(12),
    flex: 1,
    justifyContent: "center",
  },
  iconImageSmall: {
    width: scale(22),
    height: scale(22),
    tintColor: "#fff",
  },
  cartText: {
    color: "#fff",
    fontFamily: customFonts.regular.normalText,
    fontSize: moderateScale(16),
    marginLeft: scale(10),
  },
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  editButton: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
    padding: scale(20),
  },
});
