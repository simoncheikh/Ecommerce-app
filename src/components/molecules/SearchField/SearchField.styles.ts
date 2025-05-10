import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../../styles/GobalStyles";

const customFonts = GlobalStyles.fonts;


export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 10,
      paddingHorizontal: 10,
      // paddingVertical: 8,
      // marginBottom: 12,
      width:"100%"
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: 8,
      tintColor: '#666',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#000',
      fontFamily:customFonts.regular.normalText
    },
    clearButton: {
      paddingLeft: 6,
    },
    clearIcon: {
      width: 18,
      height: 18,
      tintColor: '#999',
    },
  });
  