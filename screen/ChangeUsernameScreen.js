import { KeyboardAvoidingView, View } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { db, auth } from "../config/firebase_config";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import useStore from "../zustand/store";
import styleSheet from "../assets/StyleSheet";
import LoadingScreen from "./LoadingScreen";

const ChangeUsernameScreen = ({ navigation }) => {
  const {
    user: { username },
    setUsername,
    docID,
  } = useStore((state) => state);

  const [newUsername, setNewUsername] = useState(username);
  const [validNewUsername, setValidNewUsername] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const inputTextBackGroundColor = isDarkMode
    ? styleSheet.darkModeTextInputBackGroundColor
    : styleSheet.lightModeTextInputBackGroundColor;

  const deletePress = () => setNewUsername("");

  //Update new user profile in firebase
  const setNewUserProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: newUsername.trim().toLowerCase(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  //Verify if the username is already in use
  const duplicatedUsername = async () => {
    const lowcaseUsername = newUsername.trim().toLowerCase();
    const collectionRef = collection(db, "UserInfo");

    try {
      const filter = where("username", "==", lowcaseUsername);

      const q = query(collectionRef, filter);

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs;

      //if a document with the given username is found, then return false
      if (documents.length > 0) {
        setValidNewUsername(false);
        return true;
      } else {
        setValidNewUsername(true);
        return false;
      }
    } catch (err) {
      console.log("username error:", err);
      return true;
    }
  };

  //update the username
  const updateUsername = async () => {
    try {
      setIsLoading(true);

      //If the username is already in use, return
      const result = await duplicatedUsername();

      if (result) return;

      //update the username in both userInfo and firebase profile
      const docRef = doc(db, "UserInfo", docID);
      await updateDoc(docRef, { username: newUsername.trim().toLowerCase() });
      await setNewUserProfile();
      setUsername(newUsername.trim().toLowerCase());

      navigation.goBack();
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <KeyboardAvoidingView style={styleSheet.flexStartContainer}>
      <View style={[styleSheet.formatContainer, { marginTop: "5%" }]}>
        <Text variant="titleMedium" style={textColor}>
          Username
        </Text>
        <TextInput
          style={[styleSheet.inputStyle, inputTextBackGroundColor]}
          placeholder="username"
          value={newUsername}
          onChangeText={setNewUsername}
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
        <HelperText
          type="error"
          padding="none"
          style={styleSheet.errorTextStyle}
          visible={!validNewUsername}
        >
          Username is already in resigtered
        </HelperText>
        <Button
          mode="contained"
          style={{ marginTop: "5%" }}
          onPress={updateUsername}
        >
          Update
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangeUsernameScreen;
