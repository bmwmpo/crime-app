import { useState } from "react";
import { auth } from "../../config/firebase_config";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { TextInput, Text, HelperText } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { FailDialog, SuccessDialog } from "../../component/AlertDialog";
import { Button } from "@rneui/themed";
import {
  isValidEmailAddress,
  isEmailAddressEmpty,
  isPasswordEmpty,
} from "../../functions/LogInSignUp";
import styleSheet from "../../assets/StyleSheet";
import EnumString from "../../assets/EnumString";
import useStore from "../../zustand/store";

//user log in screen
const LogInScreen = ({ navigation }) => {
  //user Info
  const {
    user: { email, password },
    setEmail,
    setPassword,
  } = useStore((state) => state);

  //state values
  const [hidePassword, setHidePassword] = useState(true);
  const [validEmailFormat, setValidEmailFormat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showSendResetPasswordDialog, setShowSendResetPasswordDialog] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogTitleMsg, setDialogTitleMsg] = useState({});
  const isDarkMode = useTheme().dark;

  //stylesheet object
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const outlinedColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor
    : styleSheet.lightModeOutlinedColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  const inputTextBackGroundColor = isDarkMode
    ? styleSheet.darkModeTextInputBackGroundColor
    : styleSheet.lightModeTextInputBackGroundColor;

  //screen window size
  const windowWidth = Dimensions.get("window").width;

  //shows or hides the password
  const showHidePasswordPress = () => setHidePassword(!hidePassword);

  //delete email text input
  const deletePress = () => setEmail("");

  //hide the error dialog
  const hideDialog = () => setShowDialog(false);

  //hide the send reset password dialog
  const hideSendResetPasswordDialog = () =>
    setShowSendResetPasswordDialog(false);

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

      //display welcome message
      // setShowSendResetPasswordDialog(true);
      // setDialogTitleMsg({
      //   title: "",
      //   message: EnumString.welcomeMsg(userCredentials.user.displayName),
      // });

      //redirect to the Main Screen upon successful sign-in
      navigation.navigate("BottomTabNavigation");
    } catch (err) {
      setShowDialog(true);
      setErrorMessage(EnumString.invalidEmaillPassword);
      setIsLoading(false);
      console.log(err);
    } finally {
      setIsLoading(false);
      navigation.setOptions({ headerShown: true });
    }
  };

  //update and verify the email state value
  const onEmailTextChange = (newText) => {
    setEmail(newText);
    setValidEmailFormat(isValidEmailAddress(newText));
  };

  //send forgot password email
  const handleForgotPassword = async () => {
    //the email address is missing
    if (isEmailAddressEmpty(email)) {
      setShowDialog(true);
      setErrorMessage(EnumString.emailIsMissing);
      return;
    }
    
    //Not a valid email address
    if (!validEmailFormat) {
      setShowDialog(true);
      setErrorMessage(EnumString.invalidEmail);
      return;
    }

    //send a rest password email
    try {
      await sendPasswordResetEmail(auth, email);
      setShowSendResetPasswordDialog(true);
      setDialogTitleMsg({
        title: EnumString.resetPasswordAlertTitle,
        message: EnumString.resetPasswordMsg(email),
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  //navigate to SignUpScreen
  const toSignUpScreen = () => navigation.navigate("SignUp");

  return (
    <KeyboardAvoidingView
      style={[styleSheet.container, backgroundColor, styleSheet.flex_1]}
      behavior={Platform.OS === "ios" && "padding"}
    >
      {/* display the dialog if the login fails or if sending the reset password fails*/}
      <FailDialog
        hideDialog={hideDialog}
        showDialog={showDialog}
        errorMessage={errorMessage}
      />
      {/* display the dialog upon successful send reset password email */}
      <SuccessDialog
        hideDialog={hideSendResetPasswordDialog}
        showDialog={showSendResetPasswordDialog}
        {...dialogTitleMsg}
      />
      <Text variant="headlineSmall" style={[styleSheet.headerStyle, textColor]}>
        Log in to Toronto Crime Tracker
      </Text>
      {/* email text input */}
      <View style={styleSheet.formatContainer}>
        <TextInput
          testID="Email"
          style={[
            styleSheet.inputStyle,
            inputTextBackGroundColor,
            styleSheet.inputPaddingStyle,
          ]}
          label="Email"
          textColor={textColor.color}
          mode="outlined"
          activeOutlineColor={outlinedColor.color}
          value={email}
          onChangeText={onEmailTextChange}
          outlineColor={
            !validEmailFormat
              ? styleSheet.errorTextStyle.color
              : styleSheet.transparentColor.color
          }
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoFocus={true}
          right={
            email !== "" && (
              <TextInput.Icon
                testID="ResetEmail"
                icon="close-circle"
                onPress={deletePress}
                iconColor={textColor.color}
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
          testID="Password"
          style={[
            styleSheet.inputStyle,
            inputTextBackGroundColor,
            styleSheet.inputPaddingStyle,
          ]}
          label="Password"
          mode="outlined"
          textColor={textColor.color}
          activeOutlineColor={outlinedColor.color}
          outlineColor={styleSheet.transparentColor.color}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={hidePassword}
          right={
            <TextInput.Icon
              testID="ShowHidePassword"
              icon={hidePassword ? "eye" : "eye-off"}
              onPress={showHidePasswordPress}
              iconColor={textColor.color}
            />
          }
        />
        {/* forgot password button */}
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
      {/* Log in button */}
      <Button
        testID="LogIn"
        title="Log in"
        buttonStyle={[styleSheet.buttonStyle, { width: windowWidth * 0.9 }]}
        titleStyle={styleSheet.buttonTextStyle}
        disabled={
          isEmailAddressEmpty(email) ||
          isPasswordEmpty(password) ||
          !validEmailFormat
        }
        disabledStyle={[
          styleSheet.disabledButtonStyle,
          { width: windowWidth * 0.9 },
        ]}
        onPress={handleLogin}
        loading={isLoading}
      />
      {/* Go to Sign Up Screen*/}
      <View style={styleSheet.flexRowContainer}>
        <Text variant="titleMedium" style={[styleSheet.textStyle, textColor]}>
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity
          testID="ToSignUp"
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
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LogInScreen;
