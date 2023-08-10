import { View, SafeAreaView, FlatList, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { db } from "../../config/firebase_config";
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { FAB } from "@rneui/themed";
import { ActivityIndicator } from "react-native-paper";
import CrimeStoryItem from "../../component/CrimeStoryItem";
import styleSheet from "../../assets/StyleSheet";
import Icon from "react-native-vector-icons/Ionicons";

//all crime stories screen
const AllCrimeStoriesScreen = () => {
  //state values
  const [allCrimeStories, setAllCrimeStories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [limitNum, setLimitNum] = useState(5);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const collectionRef = collection(db, "Postings");

  //get all crime stories from firestore
  const getAllCrimeStories = async (limitNumDoc) => {
    const q = query(
      collectionRef,
      orderBy("postingDateTime", "desc"),
      limit(limitNumDoc)
    );

    try {
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((item) => item.data());

      setAllCrimeStories(documents);
    } catch (err) {
      console.log(err);
    }
  };

  //load more data from firestore when the users scroll to the end flat list
  const loadMoreData = () => {
    setIsLoading(true);
    getAllCrimeStories(limitNum + 5);
    setLimitNum(limitNum + 5);
    setTimeout(() => setIsLoading(false), 2000);
  };

  //set FAB's visible to true when a new story is added
  const getRealTimeNewStoryAdded = async () => {
    onSnapshot(collectionRef, (snapshot) => {
      if (snapshot.docChanges().length === 1) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "removed")
            setVisible(true);
        });
      }
    });
  };

  //fetch all documents from firestore when the page is first mounted
  useEffect(() => {
    getAllCrimeStories(limitNum);
    getRealTimeNewStoryAdded();
  }, []);

  //refresh the flatlist and updatedate crime stories
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllCrimeStories(limitNum);

    setTimeout(() => {
      setRefreshing(false);
      setVisible(false);
    }, 600);
  }, []);

  return (
    <SafeAreaView style={[styleSheet.flex_1]}>
      <FAB
        icon={
          <Icon
            name="arrow-up"
            size={20}
            color={styleSheet.darkModeColor.color}
          />
        }
        color="#BA55D3"
        size="small"
        visible={visible}
        title="Update crime stories"
        onPress={onRefresh}
        style={[styleSheet.FABStyle, styleSheet.margin_Vertical]}
      />
      {/* crime stories list */}
      <FlatList
        testID="allCrimeStories"
        style={styleSheet.zindex_1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={50}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={loadMoreData}
        data={allCrimeStories}
        ItemSeparatorComponent={() => <View style={{ margin: "0.5%" }}></View>}
        keyExtractor={(item) => item.postingId}
        renderItem={({ item }) => (
          <CrimeStoryItem key={item.postingId} postingData={item} showAdsStatus={true}/>
        )}
      />
      {/* show activity indicator on end reach */}
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          size={"small"}
          color={styleSheet.highLightTextColor.color}
        />
      )}
    </SafeAreaView>
  );
};

export default AllCrimeStoriesScreen;
