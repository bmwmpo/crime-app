import { useState, useEffect } from "react";
import { auth } from "../config/firebase_config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Alert,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Text, HelperText } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { db } from "../config/firebase_config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { LogInFailedDialog, SendResetPasswordDialog } from "./AlertDialog";
import EnumString from "../assets/EnumString";
import LoadingScreen from "./LoadingScreen";
import styleSheet from "../assets/StyleSheet";

//user sign up screen
const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [validEmailFormat, setValidEmailFormat] = useState(true);
  const [validPasswordLength, setValidPasswordLength] = useState(false);
  const [validUsername, setValidUsername] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showWelcomeDialog, setShowWelocmeDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogTitleMsg, setDialogTitleMsg] = useState({});
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor.color
    : styleSheet.lightModeColor.color;
  const outlinedColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor.color
    : styleSheet.lightModeOutlinedColor.color;
  const collectionRef = collection(db, "UserInfo");

  //shows or hides the password
  const showHidePasswordPress = () => setHidePassword(!hidePassword);

  //delete the email text input
  const deletePress = () => setEmail("");

  //delete the username text input
    const deleteUserNamePress = () => setUserName("");
    
      //hide the error dialog
  const hideDialog = () => setShowDialog(false);

  //hide the send reset password dialog
  const hideWelcomeDialog = () =>
    setShowWelocmeDialog(false);

  //Verify if the username is already in use within Firestore
  const duplicatedUsername = async () => {
    const lowcaseUsername = username.toLowerCase().trim();

    try {
      const filter = where("username", "==", lowcaseUsername);
      const q = query(collectionRef, filter);

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs;

      if (documents.length > 0) {
        setValidUsername(false);
        return true;
      } else {
        setValidUsername(true);
        return false;
      }
    } catch (err) {
      console.log("username error:", err);
      return true;
    }
  };

  //save the new user infomation in firestore
  const saveUserInfoInFirestore = async ({ email, uid }) => {
    try {
      const data = {
        email,
        userId: uid,
        username: username.toLowerCase().trim(),
      };

      const docAdded = await addDoc(collectionRef, data);
    } catch (err) {
      console.log(err);
    }
  };

  //Update new user profile in firebase
  const setNewUserProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: username.trim().toLowerCase(),
      });
    } catch (error) {
      console.log(err);
    }
  };

  //sign up function
  const handleCreateNewAccount = async () => {
    try {
      //set is loading to ture
      setIsLoading(true);
      //hide the navigation header
      navigation.setOptions({ headerShown: false });

      //If the username is already registered, then return
      const duplicate = await duplicatedUsername();

      if (duplicate) return;

      //create new user in firebase
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setNewUserProfile();
      await saveUserInfoInFirestore(userCredentials.user);

        //show welcome dialog
      setShowWelocmeDialog(true);
      setDialogTitleMsg({title:'', message:EnumString.welcomeMsg(userCredentials.user.displayName)})

      //redirect to the Main Screen upon successful create new account
      navigation.navigate("BottomTabNavigation", { screen: "Map" });
    } catch (err) {
      setIsLoading(false);

      //show error dialog if sign up fail
      setShowDialog(true);
      setErrorMessage(EnumString.emailAlreadyInUse);
      console.log(err);
    } finally {
      setIsLoading(false);
      navigation.setOptions({ headerShown: true });
    }
  };

  //Check if either the email address or password is an empty string
  const isEmailusernamePasswordEmpty = () => {
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      username.trim() === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  //verify the email address
  const isValidEmailAddress = (newText) => {
    const regex = EnumString.emailRegex;
    // const result = regex.test(newText)

    setValidEmailFormat(regex.test(newText));
  };

  //verify the password length
  const isValidPasswordLength = (newText) =>
    setValidPasswordLength(newText.length >= 6);

  //update and verify the email state value
  const onEmailTextChange = (newText) => {
    setEmail(newText);
    isValidEmailAddress(newText);
  };

  //update and verify the password state value
  const onPasswordTextChange = (newText) => {
    setPassword(newText);
    isValidPasswordLength(newText);
  };

  return (
    //display loading screen when isLoading is true, otherwise display sign up form
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
        {/* display the dialog if the login fails or if sending the reset password fails*/}
        <LogInFailedDialog
          hideDialog={hideDialog}
          showDialog={showDialog}
          errorMessage={errorMessage}
        />
        {/* display the dialog upon successful send reset password email */}
        <SendResetPasswordDialog
          hideDialog={hideWelcomeDialog}
          showDialog={showWelcomeDialog}
          {...dialogTitleMsg}
        />
        <Text
          variant="headlineSmall"
          style={[
            styleSheet.headerStyle,
            isDarkMode ? styleSheet.darkModeColor : styleSheet.lightModeColor,
          ]}
        >
          Welcome to Toronro Crime Tracker
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
        {/* username text input */}
        <View style={styleSheet.formatContainer}>
          <TextInput
            style={[
              styleSheet.inputStyle,
              isDarkMode
                ? styleSheet.darkModeTextInputBackGroundColor
                : styleSheet.lightModeTextInputBackGroundColor,
            ]}
            label="Username"
            textColor={textColor}
            mode="outlined"
            activeOutlineColor={outlinedColor}
            value={username}
            onChangeText={setUserName}
            outlineColor={
              !validUsername ? styleSheet.errorTextStyle.color : "transparent"
            }
            autoCapitalize="none"
            autoCorrect={false}
            right={
              !(username === "") && (
                <TextInput.Icon
                  icon="close-circle"
                  onPress={deleteUserNamePress}
                  iconColor={textColor}
                />
              )
            }
          />
          <HelperText
            type="error"
            padding="none"
            style={styleSheet.errorTextStyle}
            visible={!validUsername}
          >
            Username is already in resigtered
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
            onChangeText={onPasswordTextChange}
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
          <HelperText
            type="error"
            padding="none"
            style={styleSheet.errorTextStyle}
            visible={!validPasswordLength}
          >
            Password must be at least 6 characters
          </HelperText>
        </View>
        <TouchableOpacity
          style={
            isEmailusernamePasswordEmpty() ||
            !validEmailFormat ||
            !validPasswordLength
              ? styleSheet.disabledButtonStyle
              : styleSheet.buttonStyle
          }
          onPress={handleCreateNewAccount}
          disabled={
            isEmailusernamePasswordEmpty() ||
            !validEmailFormat ||
            !validPasswordLength
          }
        >
          <Text variant="labelLarge" style={styleSheet.buttonTextStyle}>
            Create account
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  );
};

export default SignUpScreen;
