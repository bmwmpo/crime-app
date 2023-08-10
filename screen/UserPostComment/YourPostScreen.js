import { SafeAreaView, FlatList, View } from "react-native";
import { Text, Appbar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { db } from "../../config/firebase_config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";
import EnumString from "../../assets/EnumString";
import CrimeStoryItem from "../../component/CrimeStoryItem";
import LoadingScreen from "../LoadingScreen";
import EmptyListComponent from "../../component/EmptyListComponent";

//user's posts screen
const YourPostScreen = () => {
  //current user infor
  const { docID } = useStore((state) => state);

  //state values
  const [userPostsRef, setUserPostRef] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;

  //get real time user's crime story refs
  const getAllUserPostsRef = async () => {
    const docRef = doc(db, EnumString.userInfoCollection, docID);

    try {
      onSnapshot(docRef, (snapshot) => {
        setUserPostRef(snapshot.data().yourStory);
      });
    } catch (err) {
      console.log(err);
    }
  };

  //get all crime stories data
  const getAllUserPosts = async () => {
    const list = [];

    try {
      setIsLoading(true);
      for (let ref of userPostsRef) {
        const documents = await getDoc(ref);
        //userPostRef is arranged from oldest to newest
        list.push(documents.data());
      }

      list.sort((a, b) => b.postingDateTime - a.postingDateTime);

      setUserPosts(list);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(docID !== '')
      getAllUserPostsRef();
  }, [docID]);

  //update the crime stories list if the userPostsRef has changed
  useEffect(() => {
    getAllUserPosts();
  }, [userPostsRef]);

  return (
    <SafeAreaView style={[styleSheet.flex_1]}>
      {isLoading ? (
        <LoadingScreen />
      ) : userPosts.length === 0 ? (
        <EmptyListComponent
          title={EnumString.emptyCrimeStoriesList}
          textColor={textColor}
        />
      ) : (
        //all user posts
        <FlatList
          style={styleSheet.flex_1}
          data={userPosts}
          keyExtractor={(item) => item.postingId}
          ItemSeparatorComponent={() => <View style={{ margin: "1%" }}></View>}
          renderItem={({ item }) => (
            <CrimeStoryItem
              key={item.postingId}
              postingData={item}
              showMenu={true}
              setIsLoading={setIsLoading}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default YourPostScreen;
