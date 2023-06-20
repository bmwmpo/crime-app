import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Text, Card } from "react-native-paper";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase_config";
import { FlatList, Dimensions } from "react-native";
import styleSheet from "../assets/StyleSheet";

const CrimeStory = ({ item }) => {
  const [photoUri, setPhotoUri] = useState([]);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const retreivePhotoFromFirebaseStorage = async () => {
    setPhotoUri([]);
    try {
      for (photo of item.photo) {
        const photoRef = ref(storage, photo);
        const source = await getDownloadURL(photoRef);

        setPhotoUri((pre) => [...pre, source]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    retreivePhotoFromFirebaseStorage();
  }, []);

  return (
    <Card style={[styleSheet.flex_1, styleSheet.container]}>
      <Card.Content style={[styleSheet.height_100, styleSheet.width_100]}>
        <FlatList
          horizontal
          style={{ width: windowWidth*0.8, height: windowHeight * 0.2 }}
          data={photoUri}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Card.Cover source={{ uri: item }}  style={{ width: windowWidth*0.8, height: windowHeight * 0.2 }} />}
        />
      </Card.Content>
    </Card>
  );
};

export default CrimeStory;
