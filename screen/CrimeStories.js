import { View, SafeAreaView, FlatList, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { db } from "../config/firebase_config";
import { collection, getDocs } from "firebase/firestore";
import CrimeStory from "../component/CrimeStory";

//all crime stories screen
const CrimeStories = () => {
  const [allCrimeStories, setAllCrimeStories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //get all crime stories from firestore
  const getAllCrimeStories = async () => {
    const collectionRef = collection(db, "Postings");

    try {
      const querySnapshot = await getDocs(collectionRef);
      const documents = querySnapshot.docs.map((item) => item.data());

      //sort the crime stories by posting data and time
      const sortedDocument = documents.sort(
        (a, b) => b.postingDateTime - a.postingDateTime
      );
      setAllCrimeStories(sortedDocument);
    } catch (err) {
      console.log(err);
    }
  };

  //fetch all documents from firestore when the page is first mounted
  useEffect(() => {
    getAllCrimeStories();
  }, []);

  //refresh the flatlist and updatedate crime stories
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAllCrimeStories();
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView>
      {/* crime stories list */}
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={allCrimeStories}
        keyExtractor={(item) => item.postingId}
        renderItem={({ item }) => <CrimeStory postingData={item} />}
      />
    </SafeAreaView>
  );
};

export default CrimeStories;
