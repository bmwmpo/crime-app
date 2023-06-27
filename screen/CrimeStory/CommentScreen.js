import { SafeAreaView } from "react-native";
import { TextInput, Appbar, Button } from "react-native-paper";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { db } from "../../config/firebase_config";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import styleSheet from "../../assets/StyleSheet";
import EnumString from "../../assets/EnumString";
import useStore from "../../zustand/store";
import LoadingScreen from "../LoadingScreen";

const CommentScreen = ({ navigation, route }) => {
  const { user: currentUser } = useStore((state) => state);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //postingId of the selected crime story
  const { postingId } = route.params;

  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const inputTextBackGroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeTextInputBackGroundColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;

  //save the docId in the comment doc
  const updateCommentDoc = async (docID) => {
    try {
      const subDocRef = doc(
        db,
        EnumString.postingCollection,
        postingId,
        EnumString.commentsSubCollection,
        docID
      );

      await updateDoc(subDocRef, { commentId: docID });
    } catch (err) {
      console.log(err);
    }
  };

  //save comment in the subcollection of the assoicated posting crime story
  const saveCommentToFireStore = async () => {
    const subCollectionRef = collection(
      db,
      EnumString.postingCollection,
      postingId,
      EnumString.commentsSubCollection
    );
    try {
      setIsLoading(true);

      const newComment = {
        comment,
        replyBy: currentUser.username,
        replyDateTime: new Date(),
      };
      const commentAdded = await addDoc(subCollectionRef, newComment);

      await updateCommentDoc(commentAdded.id);

      navigation.goBack();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView style={[styleSheet.flex_1]}>
      {/* custom appbar */}
      <Appbar.Header
        style={[styleSheet.flexSpaceBetweenStyle, backgroundColor]}
      >
        {/* go back button */}
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={textColor.color}
        />
        {/* reply button */}
        <Button mode="contained" onPress={saveCommentToFireStore}>
          Reply
        </Button>
      </Appbar.Header>
      {/* comment section */}
      <TextInput
        placeholder="Add a comment"
        multiline={true}
        value={comment}
        onChangeText={setComment}
        style={[
          styleSheet.flex_1,
          inputTextBackGroundColor,
          styleSheet.fontSize_20,
        ]}
        autoFocus={true}
        autoCorrect={true}
        autoCapitalize="sentences"
        textColor={textColor.color}
      />
    </SafeAreaView>
  );
};

export default CommentScreen;