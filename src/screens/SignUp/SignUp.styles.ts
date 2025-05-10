import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";

const customFonts = GlobalStyles.fonts;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
    paddingTop: "30%",
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    gap: "3%"
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column"
  },
  titleLabel: {
    fontSize: 30,
    fontFamily:customFonts.regular.title
  },
  descLabel: {
    fontSize: 15,
    color: GlobalStyles.color.primary,
    fontFamily:customFonts.regular.normalText
  },

  label: {
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily:customFonts.regular.normalText,
  },
  error: {
    color: "red",
    fontFamily:customFonts.regular.normalText,
    marginBottom: 8
  },
  haveAnAccStyles: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 16,
  },
  loginStyle: {
    fontFamily:customFonts.regular.normalText,
    color: GlobalStyles.color.primary
  },
  fieldsContainer: {
    display: "flex",
    gap: "2%",
    flexDirection: "column",
  },
  continueLabel: {
    textAlign: "center",
    fontFamily:customFonts.regular.normalText,
    color: "gray"
  },
  signUpByBtnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "1%",
    width: "100%"
  }
});
