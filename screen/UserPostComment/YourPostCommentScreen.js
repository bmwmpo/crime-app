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

//user post and Comment screen
const YourPostCommentScreen = ({ navigation }) => {
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

  //get user's crime story refs
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
    for (let ref of userPostsRef) {
      const documents = await getDoc(ref);
      //userPostRef is arranged from oldest to newest
      list.push(documents.data());
    }

    list.sort((a, b) => b.postingDateTime - a.postingDateTime);

    setUserPosts(list);
    try {
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllUserPostsRef();
  }, []);

  //update the crime stories list if the userPostsRef has changed
  useEffect(() => {
    getAllUserPosts();
  }, [userPostsRef]);

  return (
    <SafeAreaView style={[styleSheet.flex_1]}>
      {/* custom Appbar */}
      <Appbar.Header
        style={[styleSheet.flexSpaceBetweenStyle, backgroundColor]}
      >
        {/* back action */}
        <Appbar.BackAction
          onPress={() => navigation.navigate("BottomTabNavigation")}
          color={textColor.color}
        />
        <Appbar.Content title="Your Posts" color={textColor.color} />
      </Appbar.Header>
      {isLoading ? (
        <LoadingScreen />
      ) : userPosts.length === 0 ? (
        <View style={[styleSheet.container, styleSheet.flex_1]}>
          <Text
            variant="headlineSmall"
            style={[styleSheet.padding_Vertical, textColor]}
          >
            {EnumString.emptyCrimeStoriesList}
          </Text>
        </View>
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

export default YourPostCommentScreen;
