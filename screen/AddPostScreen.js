import {
  View,
  ScrollView,
  Share,
  Alert,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import styleSheet from "../assets/StyleSheet";
import { useState } from "react";
import { db } from "../config/firebase_config";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../config/firebase_config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import NotLogInScreen from "./NotLogInScreen";
import { TextInput, FAB, Button, Card, Text } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import useStore from "../zustand/store";

const AddPostScreen = ({ navigation }) => {
  const { user: currentUser, signIn } = useStore((state) => state);
  const [story, setStory] = useState("");
  const [isStoryEmpty, setIsStoryEmpty] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoSource, setPhotoSource] = useState(null);

  const [images, setImages] = useState([]);
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  // const outlinedColor = isDarkMode
  //   ? styleSheet.darkModeOutlinedColor
  //   : styleSheet.lightModeOutlinedColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  // const inputTextBackGroundColor = isDarkMode
  //   ? { backgroundColor: "black" }
  //   : styleSheet.lightModeTextInputBackGroundColor;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  //const [textInputHeight, setTextInputHeight] = useState(0);
  //const [uploading, setUploading] = useState(false);
  //const [getPhoto, setGetPhoto] = useState(null);

  // const retreivePhoto = async () => {
  //     try {
  //         const photoRef = ref(storage, '0b6281da-e69d-4364-9059-7065d40dee89.jpeg');
  //         const source = await getDownloadURL(photoRef);

  //         setGetPhoto(source);

  //         console.log(source);
  //     }
  //     catch(err){
  //         console.error(err.message);
  //     }
  // }

  //select image from gallery
  const selectPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      const source = result.assets;
      console.log(source);
      setImages(source);
      // const filename = source.substring(source.lastIndexOf("/") + 1);
      // setPhotoUrl(source);
      // setPhotoSource(filename);
      //console.log(result.assets[0].uri, filename);
    } catch (err) {
      console.log(err);
    }
  };

  //upload a image to firebase storage
  const uploadPhoto = async () => {
    // setUploading(true);
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      //const filename = photo.substring(photo.lastIndexOf('/') + 1);

      //console.log(filename);

      const photoRef = ref(storage, photoSource);

      await uploadBytes(photoRef, blob);
    } catch (err) {
      console.error(err.message);
    }
  };

  //share the positng
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: story,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Yes");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  //save the post in firestore
  const addPost = async () => {
    try {
      //upload the phot in firebase storage
      uploadPhoto();

      const collectionRef = collection(db, "Postings");

      const postingId = uuid.v4();

      const newPosting = {
        title,
        body,
        postingId,
        photoSource,
      };

      await addDoc(collectionRef, newPosting);

      Alert.alert("Success");
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  //handle the title text change and check whether the title is empty or not
  //disable the add posting button if the title is missing
  const handleStoryTextChange = (newText) => {
    if (newText.trim() === "") setIsStoryEmpty(true);
    else setIsStoryEmpty(false);

    setStory(newText);
  };

  return !signIn ? (
    <NotLogInScreen />
  ) : (
    <Card style={[styleSheet.flex_1]}>
      <Card.Title
        title="Report a crime"
        style={[backgroundColor]}
        titleVariant="titleLarge"
        titleStyle={textColor}
      />
      <Card.Content
        style={[backgroundColor, styleSheet.height_100, styleSheet.width_100]}
      >
        <View style={[styleSheet.flexRowContainer, styleSheet.flexEndStyle]}>
          <FAB
            icon="image"
            size="small"
            variant="surface"
            style={styleSheet.margin_10}
            onPress={selectPhoto}
          />
          <FAB
            icon="share"
            size="small"
            variant="surface"
            style={styleSheet.margin_10}
            onPress={onShare}
          />
          <Card.Actions>
            <Button mode="contained">Report</Button>
          </Card.Actions>
        </View>
        <ScrollView
          contentContainerStyle={[
            {
              paddingBottom: windowHeight * 0.1,
            },
            styleSheet.createPostScrollViewStyle,
          ]}
        >
          <TextInput
            style={[styleSheet.titleTextInputStyle, backgroundColor]}
            textColor={textColor.color}
            placeholder="story"
            value={story}
            onChangeText={handleStoryTextChange}
            multiline={true}
            autoFocus={true}
            activeUnderlineColor={styleSheet.transparentColor.color}
            underlineColor={styleSheet.transparentColor.color}
            selectionColor={textColor.color}
          />
          {images && (
            <FlatList
              horizontal
              data={images}
              keyExtractor={(item) => item.uri}
              style={{ width: windowWidth, height: windowHeight * 0.7 }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: windowWidth, height: windowHeight * 0.7 }}
                />
              )}
            />
          )}
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

export default AddPostScreen;
