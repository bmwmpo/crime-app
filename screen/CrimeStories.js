import { View, SafeAreaView, FlatList, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { db } from "../config/firebase_config";
import { collection, getDocs } from "firebase/firestore";
import CrimeStory from "../component/CrimeStory";

const CrimeStories = () => {
  const [allCrimeStories, setAllCrimeStories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAllCrimeStories = async () => {
    const collectionRef = collection(db, "Postings");

    try {
      const querySnapshot = await getDocs(collectionRef);

      setAllCrimeStories(querySnapshot.docs.map((item) => item.data()));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllCrimeStories();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
        getAllCrimeStories();
        setRefreshing(false);
    }, 1000);
  },[]);

  return (
    <SafeAreaView>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={allCrimeStories}
        keyExtractor={(item) => item.postingId}
        renderItem={({ item }) => <CrimeStory item={item} />}
      />
    </SafeAreaView>
  );
};

export default CrimeStories;
