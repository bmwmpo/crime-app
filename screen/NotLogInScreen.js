import { SafeAreaView } from "react-native";
import { Text, Button } from "react-native-paper";
import styleSheet from "../assets/StyleSheet";
import { useNavigation, useTheme } from "@react-navigation/native";

//user not log in screen
const NotLogInScreen = () => {
  //navigate to log in screen
  const navigation = useNavigation();
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;

  const toLogInScreen = () =>
    navigation.navigate("SignInSignUp", { screen: "LogIn" });

  return (
    <SafeAreaView style={[styleSheet.container, styleSheet.flex_1]}>
      <Text
        variant="displaySmall"
        style={[styleSheet.displayTextStyle, textColor]}
      >
        Log in to report crimes
      </Text>
      <Button mode="contained" onPress={toLogInScreen}>
        Log in / Sign up
      </Button>
    </SafeAreaView>
  );
};

export default NotLogInScreen;
