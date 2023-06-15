import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Share,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import styleSheet from "../assets/StyleSheet";
import { useState, useContext, useEffect } from "react";
import { db } from "../config/firebase_config";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../config/firebase_config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import uuid from "react-native-uuid";
import UserContext from "../UserContext";
import NotLogInScreen from "./NotLogInScreen";

const AddPostScreen = ({ navigation }) => {
  const currentUser  = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoSource, setPhotoSource] = useState(null);
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
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      const source = result.assets[0].uri;
      const filename = source.substring(source.lastIndexOf("/") + 1);
      setPhotoUrl(source);
      setPhotoSource(filename);
      console.log(result.assets[0].uri, filename);
    } catch (err) {
      Alert.alert(err.message);
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
        title,
        message: body,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Yes");
        }
      }
    } catch (err) {
      Alert.alert(err.message);
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
  const handleTitleTextChange = (newText) => {
      if (newText.trim() === "")
          setIsTitleEmpty(true);
      else
          setIsTitleEmpty(false);

    setTitle(newText);
  };

  return !currentUser.signIn ? (
    <NotLogInScreen />
  ) : (
    <KeyboardAvoidingView
      style={styleSheet.postingContainer}
      keyboardVerticalOffset={200}
      behavior={Platform.OS === "ios" && "height"}
    >
      {/* title text input */}
      <View style={styleSheet.titleBodyContainer}>
        <TextInput
          style={styleSheet.titleTextInputStyle}
          placeholder="Title"
          value={title}
          onChangeText={handleTitleTextChange}
          multiline={true}
          autoFocus={true}
        />
        {/* body text input */}
        <TextInput
          style={styleSheet.bodyTextInputStyle}
          placeholder="Body"
          value={body}
          onChangeText={setBody}
          multiline={true}
        />
      </View>
      {photoUrl && (
        <Image source={{ uri: photoUrl }} style={{ width: 300, height: 300 }} />
      )}
      {/* add post and share buttons */}
      <View style={styleSheet.optionBarStyle}>
        <TouchableOpacity onPress={addPost} disabled={isTitleEmpty}>
          <Icon
            name="add-circle-outline"
            size={40}
            color={isTitleEmpty ? "#a9a9a9" : "#000000"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare}>
          <Icon name="share-social-outline" size={40} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={selectPhoto}>
          <Icon name="image-outline" size={40} color="#000000" />
        </TouchableOpacity>
        {/* <Button title="Upload" onPress={uploadPhoto}/> */}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddPostScreen;
