import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/GobalStyles";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: "5%",
    paddingTop:"30%",
    backgroundColor: "white",
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    gap:"5%"
  },
  titleContainer: { 
    display: "flex", 
    flexDirection: "column" 
  },
  titleLabel: { 
    fontSize: 30, 
    fontWeight: "900" 
  },
  descLabel: { 
    fontSize: 15, 
    color: GlobalStyles.color.primary 
  },

  label: { 
    fontWeight: "bold", 
    marginBottom: 4 
  },
  error: { 
    color: "red", 
    marginBottom: 8 
  },
  haveAnAccStyles: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 16,
  },
  loginStyle: {
     color: GlobalStyles.color.primary 
    },
  fieldsContainer: { 
    display: "flex", 
    height: "30%", 
    flexDirection: "column", 
    gap: "5%" 
  },
  continueLabel: { 
    textAlign: "center", 
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
