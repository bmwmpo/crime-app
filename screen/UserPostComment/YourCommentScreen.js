import { SafeAreaView, FlatList, View } from "react-native";
import { db } from "../../config/firebase_config";
import { getDoc, onSnapshot, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import useStore from "../../zustand/store";
import styleSheet from "../../assets/StyleSheet";
import LoadingScreen from "../LoadingScreen";
import EnumString from "../../assets/EnumString";
import EmptyListComponent from "../../component/EmptyListComponent";
import YourCommentsComponent from "../../component/YourCommentsComponent";

//user's comment screen
const YourCommentScreen = () => {
  //current user infor
  const { docID } = useStore((state) => state);

  //state values
  const [userCommentRef, setUserCommentRef] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;

  //get all user's comment refs
  const getAllUserCommentRef = async () => {
    const docRef = doc(db, EnumString.userInfoCollection, docID);
    try {
      onSnapshot(docRef, (snapshot) => {
        setUserCommentRef(snapshot.data().yourComments);
      });
    } catch (err) {
      console.log(err);
    }
  };

  //get all user's comments
  const getAllUserCommnets = async () => {
    const list = [];

    try {
      for (let ref of userCommentRef) {
        const document = await getDoc(ref.commentRef);

        list.push({
          ...document.data(),
          postingRef: ref.postingRef,
        });
      }

      list.sort((a, b) => b.replyDateTime - a.replyDateTime);
      setUserComments(list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if(docID !== '')
      getAllUserCommentRef();
  }, [docID]);

  //update the comment list if the userCommentRef list has changed
  useEffect(() => {
    setIsLoading(true);
    getAllUserCommnets();
    setTimeout(() => setIsLoading(false), 1000);
  }, [userCommentRef]);

  return (
    <SafeAreaView style={[styleSheet.flex_1]}>
      {isLoading ? (
        <LoadingScreen />
      ) : userComments.length === 0 ? (
        <EmptyListComponent
          title={EnumString.emptyCommentsList}
          textColor={textColor}
        />
      ) : (
        //all user posts
        <FlatList
          style={styleSheet.flex_1}
          data={userComments}
          keyExtractor={(item) => item.commentId}
          ItemSeparatorComponent={() => <View style={{ margin: "1%" }}></View>}
          renderItem={({ item }) => (
            <YourCommentsComponent
              key={item.commentId}
              commentData={item}
              postingRef={item.postingRef}
              setIsLoading={setIsLoading}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default YourCommentScreen;
