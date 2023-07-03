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
import { updateProfile } from "firebase/auth";
import { Button } from "@rneui/themed";
import useStore from "../../zustand/store";
import styleSheet from "../../assets/StyleSheet";
import EnumString from "../../assets/EnumString";

//edit username screen
const EditUsernameScreen = ({ navigation }) => {
  const {
    user: { username, email },
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
  const windowWidth = Dimensions.get("window").width;

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
    const collectionRef = collection(db, EnumString.userInfoCollection);

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

  //update the username for the comments created by the current user
  const updateAllComments = async (postingId) => {
    try {
      const commentCollectionRef = collection(
        db,
        EnumString.postingCollection,
        postingId,
        EnumString.commentsSubCollection
      );
      const filter = where("userEmail", "==", email);
      const q = query(commentCollectionRef, filter);

      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs;

      if (documents.length > 0) {
        for (const document of documents)
        {
          const docRef = doc(
            db,
            EnumString.postingCollection,
            postingId,
            EnumString.commentsSubCollection,
            document.data().commentId
          );
          await updateDoc(docRef, { replyBy: newUsername });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //update the username field for all postings and comments created by the current user
  const updateAllPostsComments = async () => {
    const collectionRef = collection(db, EnumString.postingCollection);
    const filter = where("userEmail", "==", email);
    const q = query(collectionRef, filter);

    try {
      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs;

      if (documents.length > 0) {
        for (const document of documents) {
          const docRef = doc(
            db,
            EnumString.postingCollection,
            document.data().postingId
          );

          await updateDoc(docRef, { postBy: newUsername });
          await updateAllComments(document.data().postingId);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //update the username
  const updateUsername = async () => {
    try {
      setIsLoading(true);

      //If the username is already in use, return
      const result = await duplicatedUsername();

      if (result) return;

      //update the username in both userInfo , firebase profile, and all posting and comments
      const docRef = doc(db, EnumString.userInfoCollection, docID);
      await updateDoc(docRef, { username: newUsername.trim().toLowerCase() });
      await setNewUserProfile();
      await updateAllPostsComments();
      setUsername(newUsername.trim().toLowerCase());

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
          title="Update"
          buttonStyle={[styleSheet.buttonStyle, { width: windowWidth * 0.9 }]}
          titleStyle={styleSheet.buttonTextStyle}
          onPress={updateUsername}
          loading={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditUsernameScreen;
