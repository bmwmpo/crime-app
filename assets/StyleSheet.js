import { StyleSheet } from "react-native";

const styleSheet = StyleSheet.create({
  //Login Screen and SignUp Screen
  flex_9: {
    flex: 9,
  },
  flex_1: {
    flex: 1,
  },
  darkModeBackGroundColor: {
    backgroundColor: "#0C090A",
  },
  lightModeBackGroundColor: {
    backgroundColor: "#FFFFFF",
  },
  darkModeTextInputBackGroundColor: {
    backgroundColor: "#838996",
  },
  lightModeTextInputBackGroundColor: {
    backgroundColor: "#E5E4E2",
  },
  darkModeOutlinedColor: {
    color: "#E5E4E2",
  },
  lightModeOutlinedColor: {
    color: "#616D7E",
  },
  textColor: {
    color: "#E5E4E2",
  },
  lightModeColor: {
    color: "#0C090A",
  },
  darkModeColor: {
    color: "#E5E4E2",
  },
  highLightTextColor: {
    color: "#9400D3",
  },
  logoutColor: {
    color: "#E41B17",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
    flexStartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  formatContainer: {
    width: "90%",
  },
  touchableRippleWidth: {
    width: "50%",
  },
  flexRowContainer: {
    flexDirection: "row",
  },
  loadingViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerStyle: {
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorTextStyle: {
    fontSize: 15,
    color: "#FF0000",
  },
  underLineTextStyle: {
    textDecorationLine: "underline",
  },
  textStyle: {
    fontWeight: "bold",
  },
  displayTextStyle: {
    margin: 40,
    width: "100%",
    textAlign: "center",
  },
  inputStyle: {
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  iconStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    backgroundColor: "#9400D3",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginVertical: 30,
  },
  disabledButtonStyle: {
    backgroundColor: "#686A6C",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginVertical: 30,
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  //AddPostScreen
  postingContainer: {
    //backgroundColor: "#808080",
    alignItems: "flex-start",
    justifyContent: "space-between",
    //flex: 1,
  },
  titleBodyContainer: {
    flex: 1,
    width: "100%",
  },
  titleTextInputStyle: {
    width: "100%",
    textAlignVertical: "top",
    fontSize: 25,
    flex:1,
    zIndex:1
    //borderColor: "#696969",
  },
  bodyTextInputStyle: {
    width: "100%",
    textAlignVertical: "top",
  },
  optionBarStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  drawerContainer: {
    //flexDirection: "row",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
  },
  drawerTextStyle: {
    textAlign: "left",
    marginHorizontal: "10%",
    fontWeight: "bold",
    width: "80%",
  },
  usernameStyle: {
    margin: 10
  },
  textFontSize: {
    fontSize:20
  }
});

export default styleSheet;
