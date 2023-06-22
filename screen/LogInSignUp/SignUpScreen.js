import { useState, useEffect } from "react";
import { auth } from "../../config/firebase_config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Text, HelperText } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { db } from "../../config/firebase_config";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FailDialog, SuccessDialog } from "../../component/AlertDialog";
import EnumString from "../../assets/EnumString";
import LoadingScreen from "../LoadingScreen";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";

//user sign up screen
const SignUpScreen = ({ navigation }) => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  const {
    user: { email, password, username },
    setEmail,
    setPassword,
    setUsername,
  } = useStore((state) => state);

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
  const collectionRef = collection(db, "UserInfo");

  //shows or hides the password
  const showHidePasswordPress = () => setHidePassword(!hidePassword);

  //delete the email text input
  const deletePress = () => setEmail("");

  //delete the username text input
  const deleteUserNamePress = () => setUsername("");

  //hide the error dialog
  const hideDialog = () => setShowDialog(false);

  //hide the send reset password dialog
  const hideWelcomeDialog = () => setShowWelocmeDialog(false);

  //Verify if the username is already in use within Firestore
  const duplicatedUsername = async () => {
    const lowcaseUsername = username.toLowerCase().trim();

    try {
      const filter = where("username", "==", lowcaseUsername);
      const q = query(collectionRef, filter);

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs;

      //if a document with the given username is found, then return false
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
      const docRef = doc(db, "UserInfo", docAdded.id);
      await updateDoc(docRef, { docID: docAdded.id });
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
    } catch (err) {
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

      setIsLoading(false);
      navigation.setOptions({ headerShown: true });

      //redirect to the Main Screen upon successful create new account
      navigation.navigate("BottomTabNavigation", { screen: "Map" });
      //show welcome dialog
      setShowWelocmeDialog(true);
      setDialogTitleMsg({
        title: "",
        message: EnumString.welcomeMsg(userCredentials.user.displayName),
      });
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
        style={[styleSheet.container, backgroundColor, styleSheet.flex_1]}
        behavior={Platform.OS === "ios" && "padding"}
      >
        {/* display the dialog if the sign up fails*/}
        <FailDialog
          hideDialog={hideDialog}
          showDialog={showDialog}
          errorMessage={errorMessage}
        />
        {/* display the dialog upon successful create new account */}
        <SuccessDialog
          hideDialog={hideWelcomeDialog}
          showDialog={showWelcomeDialog}
          {...dialogTitleMsg}
        />
        <Text
          variant="headlineSmall"
          style={[styleSheet.headerStyle, textColor]}
        >
          Welcome to Toronro Crime Tracker
        </Text>
        {/* email text input */}
        <View style={styleSheet.formatContainer}>
          <TextInput
            style={[
              styleSheet.inputStyle,
              inputTextBackGroundColor,
              ,
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
              !(email === "") && (
                <TextInput.Icon
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
        {/* username text input */}
        <View style={styleSheet.formatContainer}>
          <TextInput
            style={[
              styleSheet.inputStyle,
              inputTextBackGroundColor,
              styleSheet.inputPaddingStyle,
            ]}
            label="Username"
            textColor={textColor.color}
            mode="outlined"
            activeOutlineColor={outlinedColor.color}
            value={username}
            onChangeText={setUsername}
            outlineColor={
              !validUsername
                ? styleSheet.errorTextStyle.color
                : styleSheet.transparentColor.color
            }
            autoCapitalize="none"
            autoCorrect={false}
            right={
              !(username === "") && (
                <TextInput.Icon
                  icon="close-circle"
                  onPress={deleteUserNamePress}
                  iconColor={textColor.color}
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
              styleSheet.inputPaddingStyle,
              inputTextBackGroundColor,
            ]}
            label="Password"
            mode="outlined"
            textColor={textColor.color}
            activeOutlineColor={outlinedColor.color}
            outlineColor={styleSheet.transparentColor.color}
            value={password}
            onChangeText={onPasswordTextChange}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={hidePassword}
            right={
              <TextInput.Icon
                icon={hidePassword ? "eye" : "eye-off"}
                onPress={showHidePasswordPress}
                iconColor={textColor.color}
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
