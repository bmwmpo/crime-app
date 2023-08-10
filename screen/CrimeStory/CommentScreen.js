import { SafeAreaView } from "react-native";
import { TextInput, Appbar, Button } from "react-native-paper";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { db } from "../../config/firebase_config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import styleSheet from "../../assets/StyleSheet";
import EnumString from "../../assets/EnumString";
import useStore from "../../zustand/store";
import LoadingScreen from "../LoadingScreen";

const CommentScreen = ({ navigation, route }) => {
  //current user infor
  const { user: currentUser, docID } = useStore((state) => state);

  //state values
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //postingId of the selected crime story
  const { postingId } = route.params;

  //styling
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

  //save the newly added comment in user's comment list in firestore
  const UpdateUserCommentList = async (postingRef, commentRef) => {
    const docRef = doc(db, EnumString.userInfoCollection, docID);
    
    try {
      const newComment = {
        postingRef,
        commentRef,
      };

      await updateDoc(docRef, { yourComments: arrayUnion(newComment) });
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

      const userDocRef = doc(db, EnumString.userInfoCollection, docID);
      const newComment = {
        comment,
        replyDateTime: new Date(),
        upVote: 0,
        voters: [],
        user: userDocRef,
      };

      //save the comment in the subcollection 'Comments'
      const commentAdded = await addDoc(subCollectionRef, newComment);
      const postingRef = doc(db, EnumString.postingCollection, postingId);
      const commentRef = doc(
        db,
        EnumString.postingCollection,
        postingId,
        EnumString.commentsSubCollection,
        commentAdded.id
      );

      await updateCommentDoc(commentAdded.id);
      await UpdateUserCommentList(postingRef, commentRef);

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
