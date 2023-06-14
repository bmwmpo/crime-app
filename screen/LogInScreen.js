import { useState } from "react";
import { auth } from "../config/firebase_config";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  Alert,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Text,
  HelperText,
  TouchableRipple,
} from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import styleSheet from "../assets/StyleSheet";
import EnumString from "../assets/EnumString";
import LoadingScreen from "./LoadingScreen";

//user log in screen
const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [validEmailFormat, setValidEmailFormat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor.color
    : styleSheet.lightModeColor.color;
  const outlinedColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor.color
    : styleSheet.lightModeOutlinedColor.color;

  //shows or hides the password
  const showHidePasswordPress = () => setHidePassword(!hidePassword);

  //delete email text input
  const deletePress = () => setEmail("");

  //login function
  const handleLogin = async () => {
    try {
      //set to is loading
      setIsLoading(true);
      //hide the navigation header
      navigation.setOptions({ headerShown: false });

      //sign to firebase
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert("Welcome");

      //redirect to the Main Screen upon successful sign-in
      navigation.navigate("BottomTabNavigation", { screen: "Map" });
    } catch (err) {
      Alert.alert("Error", EnumString.invaildEmaillPassword);
      setIsLoading(false);
      console.log(err);
    } finally {
      setIsLoading(false);
      navigation.setOptions({ headerShown: true });
    }
  };

  //check whether the email or password is empty or not
  const isEmailAddressPasswordEmpty = () =>
    email.trim() === "" || password.trim() === "" ? true : false;

  //verify the email address format
  const isValidEmailAddress = (newText) => {
    const regex = EnumString.emailRegex;

    setValidEmailFormat(regex.test(newText));
  };

  //update and verify the email state value
  const onEmailTextChange = (newText) => {
    setEmail(newText);
    isValidEmailAddress(newText);
  };

  //send forgot password email
  const handleForgotPassword = async () => {
    //Not a valid email address
    if (!validEmailFormat) {
      Alert.alert("Not a valid email address");
      return;
    }

    //the email address is missing
    if (isEmailAddressPasswordEmpty()) {
      Alert.alert("Email address is missing");
      return;
    }

    //send a rest password email
    try {
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        EnumString.resetPasswordAlertTitle,
        EnumString.resetPasswordMsg(email)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  //navigate to SignUpScreen
  const toSignUpScreen = () => navigation.navigate("SignUp");

  return (
    //display loading screen when isLoading is true, otherwise display login form
    isLoading ? (
      <LoadingScreen />
    ) : (
      <KeyboardAvoidingView
        style={[
          styleSheet.container,
          isDarkMode
            ? styleSheet.darkModeBackGroundColor
            : styleSheet.lightModeBackGroundColor,
        ]}
        behavior={Platform.OS === "ios" && "padding"}
      >
        <Text
          variant="headlineSmall"
          style={[
            styleSheet.headerStyle,
            isDarkMode ? styleSheet.darkModeColor : styleSheet.lightModeColor,
          ]}
        >
          Log in to Toronto Crime Tracker
        </Text>
        {/* email text input */}
        <View style={styleSheet.formatContainer}>
          <TextInput
            style={[
              styleSheet.inputStyle,
              isDarkMode
                ? styleSheet.darkModeTextInputBackGroundColor
                : styleSheet.lightModeTextInputBackGroundColor,
            ]}
            label="Email"
            textColor={textColor}
            mode="outlined"
            activeOutlineColor={outlinedColor}
            value={email}
            onChangeText={onEmailTextChange}
            outlineColor={
              !validEmailFormat
                ? styleSheet.errorTextStyle.color
                : "transparent"
            }
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoFocus={true}
            right={
              !(email === "") && (
                <TextInput.Icon
                  icon="close-circle"
                  onPress={deletePress}
                  iconColor={textColor}
                />
              )
            }
          />
          <HelperText
            type="error"
            padding="none"
            style={styleSheet.errorTextStyle}
            visible={!validEmailFormat}
          >
            Not a valid email address
          </HelperText>
        </View>
        {/* password text input */}
        <View style={styleSheet.formatContainer}>
          <TextInput
            style={[
              styleSheet.inputStyle,
              isDarkMode
                ? styleSheet.darkModeTextInputBackGroundColor
                : styleSheet.lightModeTextInputBackGroundColor,
            ]}
            label="Password"
            mode="outlined"
            textColor={textColor}
            activeOutlineColor={outlinedColor}
            outlineColor="transparent"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={hidePassword}
            right={
              <TextInput.Icon
                icon={hidePassword ? "eye" : "eye-off"}
                onPress={showHidePasswordPress}
                iconColor={textColor}
              />
            }
          />
          {/* forgot password button */}
          <TouchableRipple
            style={styleSheet.touchableRippleWidth}
            onPress={handleForgotPassword}
            rippleColor={styleSheet.highLightTextColor.color}
          >
            <Text
              variant="titleMedium"
              style={[
                styleSheet.underLineTextStyle,
                styleSheet.highLightTextColor,
              ]}
            >
              Forgot your password?
            </Text>
          </TouchableRipple>
        </View>
        {/* Log in button */}
        <TouchableOpacity
          style={
            isEmailAddressPasswordEmpty() || !validEmailFormat
              ? styleSheet.disabledButtonStyle
              : styleSheet.buttonStyle
          }
          onPress={handleLogin}
          disabled={isEmailAddressPasswordEmpty() || !validEmailFormat}
        >
          <Text
            variant="labelLarge"
            style={[
              styleSheet.buttonTextStyle,
              isDarkMode ? styleSheet.darkModeColor : styleSheet.lightModeColor,
            ]}
          >
            Log in
          </Text>
        </TouchableOpacity>
        {/* Go to Sign Up Screen*/}
        <View style={styleSheet.flexRowContainer}>
          <Text
            variant="titleMedium"
            style={[
              styleSheet.textStyle,
              isDarkMode ? styleSheet.darkModeColor : styleSheet.lightModeColor,
            ]}
          >
            Don't have an account?{" "}
          </Text>
          <TouchableRipple
            onPress={toSignUpScreen}
            rippleColor={styleSheet.highLightTextColor.color}
          >
            <Text
              variant="titleMedium"
              style={[
                styleSheet.underLineTextStyle,
                styleSheet.highLightTextColor,
              ]}
            >
              Sign Up here
            </Text>
          </TouchableRipple>
        </View>
      </KeyboardAvoidingView>
    )
  );
};

export default LogInScreen;
