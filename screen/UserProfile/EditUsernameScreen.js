import { KeyboardAvoidingView, View, Dimensions } from "react-native";
import { TextInput, Text, HelperText } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { db, auth } from "../../config/firebase_config";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { updateProfile,  } from "firebase/auth";
import { Button } from "@rneui/themed";
import { setNewUserProfile, duplicatedUsername } from "../../functions/editUserProfile";
import useStore from "../../zustand/store";
import styleSheet from "../../assets/StyleSheet";
import EnumString from "../../assets/EnumString";

//edit username screen
const EditUsernameScreen = ({ navigation }) => {
  //current user info
  const {
    user: { username, email },
    setUsername,
    docID,
  } = useStore((state) => state);

  //state values
  const [newUsername, setNewUsername] = useState(username);
  const [validNewUsername, setValidNewUsername] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const inputTextBackGroundColor = isDarkMode
    ? styleSheet.darkModeTextInputBackGroundColor
    : styleSheet.lightModeTextInputBackGroundColor;
  const windowWidth = Dimensions.get("window").width;

  const collectionRef = collection(db, EnumString.userInfoCollection);

  const deletePress = () => setNewUsername("");

  //return true if the username input text is empty
  const isUsernameEmpty = () => {
    if (newUsername.trim() === "") return true;
    else return false;
  };

  //update the username
  const updateUsername = async () => {
    try {
      setIsLoading(true);

      //If the username is already in use, return
      const result = await duplicatedUsername(collectionRef, newUsername, setValidNewUsername);

      const trimUsername = newUsername.trim();
      const capitalizeUsername =
        trimUsername[0].toUpperCase() +
        trimUsername.toLowerCase().substring(1, trimUsername.length);

      if (result) return;

      //update the username in both userInfo , firebase profile, and all posting and comments
      const docRef = doc(db, EnumString.userInfoCollection, docID);
      await updateDoc(docRef, { username: capitalizeUsername });
      await setNewUserProfile(newUsername);
      setUsername(capitalizeUsername);

      navigation.goBack();
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styleSheet.container}>
      <View style={[styleSheet.formatContainer, { marginTop: "5%" }]}>
        <Text variant="titleMedium" style={textColor}>
          Username
        </Text>
        {/* username textInput */}
        <TextInput
          testID="usernameTextInput"
          style={[styleSheet.inputStyle, inputTextBackGroundColor]}
          placeholder="username"
          value={newUsername}
          onChangeText={setNewUsername}
          autoFocus={true}
          right={
            !(newUsername === "") && (
              <TextInput.Icon
                icon="close-circle"
                onPress={deletePress}
                iconColor={textColor.color}
              />
            )
          }
        />
        {/* error message */}
        <HelperText
          type="error"
          padding="none"
          style={styleSheet.errorTextStyle}
          visible={!validNewUsername}
        >
          Username is already in resigtered
        </HelperText>
        {/* update button */}
        <Button
          title="Update"
          buttonStyle={[styleSheet.buttonStyle, { width: windowWidth * 0.9 }]}
          titleStyle={styleSheet.buttonTextStyle}
          onPress={updateUsername}
          loading={isLoading}
          disabled={isUsernameEmpty()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditUsernameScreen;
