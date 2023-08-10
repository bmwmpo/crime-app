import { SafeAreaView } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation, useTheme } from "@react-navigation/native";
import styleSheet from "../../assets/StyleSheet";

//user not log in screen
const NotLogInScreen = () => {
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
      {/* to log in screen button */}
      <Button mode="contained" onPress={toLogInScreen}>
        Log in / Sign up
      </Button>
    </SafeAreaView>
  );
};

export default NotLogInScreen;
