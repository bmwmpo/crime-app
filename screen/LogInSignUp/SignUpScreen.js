import { useState, useEffect } from "react";
import { auth } from "../../config/firebase_config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
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
import { Button } from "@rneui/themed";
import {
  setNewUserProfile,
  duplicatedUsername,
} from "../../functions/editUserProfile";
import {
  isValidEmailAddress,
  isEmailAddressEmpty,
  isUsernameEmpty,
  isPasswordEmpty,
  isValidPasswordLength,
} from "../../functions/LogInSignUp";
import EnumString from "../../assets/EnumString";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";

//user sign up screen
const SignUpScreen = ({ navigation }) => {
  //user Info
  const {
    user: { email, password, username },
    setEmail,
    setPassword,
    setUsername,
  } = useStore((state) => state);

  //state values
  const [hidePassword, setHidePassword] = useState(true);
  const [validEmailFormat, setValidEmailFormat] = useState(true);
  const [validPasswordLength, setValidPasswordLength] = useState(true);
  const [validUsername, setValidUsername] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showWelcomeDialog, setShowWelocmeDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogTitleMsg, setDialogTitleMsg] = useState({});
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  //styling
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
  const collectionRef = collection(db, EnumString.userInfoCollection);
  const windowWidth = Dimensions.get("window").width;

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

  //save the new user infomation in firestore
  const saveUserInfoInFirestore = async ({ email, uid }) => {
    const trimUsername = username.trim();
    const capitalizeUsername =
      trimUsername[0].toUpperCase() +
      trimUsername.toLowerCase().substring(1, trimUsername.length);

    try {
      const data = {
        email,
        userId: uid,
        username: capitalizeUsername,
        preference: {
          darkMode: false,
          avatarColor: "#9400D3",
          autoDarkMode: false,
        },
        location: {enabled: false, coords: null},
        yourStory: [],
        yourComments: [],
      };

      const docAdded = await addDoc(collectionRef, data);
      const docRef = doc(db, "UserInfo", docAdded.id);
      await updateDoc(docRef, { docID: docAdded.id });
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
      const duplicate = await duplicatedUsername(
        collectionRef,
        username,
        setValidUsername
      );

      if (duplicate) return;

      //create new user in firebase
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setNewUserProfile(username);
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
      setValidEmailFormat(false);
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

  //update and verify the password state value
  const onPasswordTextChange = (newText) => {
    setPassword(newText);
    setValidPasswordLength(isValidPasswordLength(newText));
  };

  //keyboard module
  useEffect(() => {
    //keyboardDidShow
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    //keyboardDidHide
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    //dispatch the listeners
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
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
      {
        //hide the title when the keyboard did show
        !keyboardStatus && (
          <Text
            variant="headlineSmall"
            style={[styleSheet.headerStyle, textColor]}
          >
            Welcome to Toronro Crime Tracker
          </Text>
        )
      }
      {/* email text input */}
      <View style={styleSheet.formatContainer}>
        <TextInput
          testID="Email"
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
      {/* username text input */}
      <View style={styleSheet.formatContainer}>
        <TextInput
          testID="Username"
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
            username !== "" && (
              <TextInput.Icon
                testID="ResetUsername"
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
          testID="Password"
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
      {/* create account button */}
      <Button
        title="Create account"
        buttonStyle={[styleSheet.buttonStyle, { width: windowWidth * 0.9 }]}
        titleStyle={styleSheet.buttonTextStyle}
        disabled={
          isEmailAddressEmpty(email) ||
          isUsernameEmpty(username) ||
          isPasswordEmpty(password) ||
          !validEmailFormat ||
          !validPasswordLength
        }
        disabledStyle={[
          styleSheet.disabledButtonStyle,
          { width: windowWidth * 0.9 },
        ]}
        onPress={handleCreateNewAccount}
        loading={isLoading}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
