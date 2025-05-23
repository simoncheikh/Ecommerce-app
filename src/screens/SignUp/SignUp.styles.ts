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
    fontFamily: customFonts.regular.title
  },
  descLabel: {
    fontSize: 15,
    color: GlobalStyles.color.primary,
    fontFamily: customFonts.regular.normalText
  },

  label: {
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: customFonts.regular.normalText,
  },
  error: {
    color: "red",
    fontFamily: customFonts.regular.normalText,
    marginBottom: 8
  },
  haveAnAccStyles: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 16,
  },
  loginStyle: {
    fontFamily: customFonts.regular.normalText,
    color: GlobalStyles.color.primary
  },
  fieldsContainer: {
    display: "flex",
    gap: "2%",
    flexDirection: "column",
  },
  continueLabel: {
    textAlign: "center",
    fontFamily: customFonts.regular.normalText,
    color: "gray"
  },
  signUpByBtnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "1%",
    width: "100%"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
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
  inputGroup: {
  },
  profileImageContainer: {
    position: "relative"
  },
  profileImage: {
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
});
