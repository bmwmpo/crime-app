import { StyleSheet } from "react-native";

const styleSheet = StyleSheet.create({
  //flex
  flex_9: {
    flex: 9,
  },
  flex_1: {
    flex: 1,
  },
  zindex_1: {
    zindex: 1,
  },
  alignCenter: {
    alignItems:'center'
  },
  //padding & margin
  margin_Horizontal: {
    marginHorizontal: "10%",
  },
  margin_Horizontal_3: {
    marginHorizontal: "3%",
  },
  margin_Horizontal_right: {
    marginRight: "5%",
  },
  margin_Vertical: {
    marginVertical: "3%",
  },
  padding_Horizontal: {
    paddingHorizontal: "3%",
  },
  padding_Vertical: {
    paddingVertical: "3%",
  },
  height_100: {
    height: "100%",
  },
  width_100: {
    width: "100%",
  },
  //color
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
  transparentColor: {
    color: "transparent",
  },
  //container
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  flexStartContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  formatContainer: {
    width: "90%",
  },
  touchableRippleWidth: {
    width: "100%",
  },
  flexRowContainer: {
    flexDirection: "row",
  },
  flexEndStyle: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  flexSpaceBetweenStyle: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  //text
  fontSize_20: {
    fontSize: 20,
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
  },
  inputPaddingStyle: {
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
  titleTextInputStyle: {
    width: "100%",
    textAlignVertical: "top",
    fontSize: 20,
    marginBottom: "1%",
  },
  drawerTextStyle: {
    textAlign: "left",
    marginHorizontal: "10%",
    fontWeight: "bold",
    width: "80%",
  },
  drawerBottomStyle: {
    flex: 1,
    justifyContent: "flex-end",
  },
  drawerOptionsStyle: {
    flex: 3,
    justifyContent: "space-between",
  },
  textFontSize: {
    fontSize: 20,
  },
  //create post
  createPostScrollViewStyle: {
    justifyContent: "space-between",
    alignItems:'flex-start',
  },
  FABStyle: {
    zIndex: 2,
    backgroundColor: "transparent",
    position: "absolute",
    right: 0,
    left: 0,
  },
});

export default styleSheet;
