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
import CrimeStoryItem from "../../component/CrimeStoryItem";
import styleSheet from "../../assets/StyleSheet";
import Icon from 'react-native-vector-icons/Ionicons';

//all crime stories screen
const AllCrimeStoriesScreen = () => {
  const [allCrimeStories, setAllCrimeStories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [limitNum, setLimitNum] = useState(5);
  const [visible, setVisible] = useState(false);
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

      //sort the crime stories by posting data and time
      // const sortedDocument = documents.sort(
      //   (a, b) => b.postingDateTime - a.postingDateTime
      // );
      setAllCrimeStories(documents);
    } catch (err) {
      console.log(err);
    }
  };

  //load more data from firestore when the users scroll to the end flat list
  const loadMoreData = () => {
    getAllCrimeStories(limitNum + 5);
    setLimitNum(limitNum + 5);
  };

  //set FAB's visible to true when a new story is added
  const getRealTimeNewStoryAdded = async () => {
    onSnapshot(collectionRef, (snapshot) => {
      if (snapshot.docChanges().length === 1) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") setVisible(true);
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
    setTimeout(() => {
      getAllCrimeStories(limitNum);
      setRefreshing(false);
      setVisible(false);
    }, 800);
  }, []);

  return (
    <SafeAreaView style={ [styleSheet.flex_1]}>
      <FAB
        icon={ <Icon name='arrow-up' size={ 20 } color={ styleSheet.darkModeColor.color} /> }
        color="#BA55D3"
        size="small"
        visible={visible}
        title="new stories added"
        onPress={onRefresh}
        style={[styleSheet.FABStyle, styleSheet.margin_Vertical]}
      />
      {/* crime stories list */}
      <FlatList
        style={styleSheet.zindex_1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={50}/>
        }
        onEndReachedThreshold={0.5}
        onEndReached={loadMoreData}
        data={allCrimeStories}
        ItemSeparatorComponent={() => <View style={{ margin: "1%" }}></View>}
        keyExtractor={(item) => item.postingId}
        renderItem={ ({ item }) => <CrimeStoryItem key={ item.postingId } postingData={item} />}
      />
    </SafeAreaView>
  );
};

export default AllCrimeStoriesScreen;
