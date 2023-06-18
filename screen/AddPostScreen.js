import {
  View,
  Text,
  Button,
  Pressable,
  TouchableOpacity,
    KeyboardAvoidingView,
  ScrollView,
  Platform,
  Share,
  Alert,
  Image,
  SafeAreaView,
  FlatList,Dimensions
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
import NotLogInScreen from "./NotLogInScreen";
import { TextInput, Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from "@react-navigation/native";
import useStore from "../zustand/store";

const AddPostScreen = ({ navigation }) => {
  const { user: currentUser, signIn } = useStore(state=>state)
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoSource, setPhotoSource] = useState(null);
  
  const [images, setImages] = useState([]);
    const { bottom } = useSafeAreaInsets();
      const isDarkMode = useTheme().dark;
      const outlinedColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor
          : styleSheet.lightModeOutlinedColor;
    const backgroundColor = isDarkMode
            ? styleSheet.darkModeBackGroundColor
      : styleSheet.lightModeBackGroundColor
  const width = Dimensions.get('window').width;
   const height = Dimensions.get('window').height
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
        allowsMultipleSelection:true,
        aspect: [4, 3],
        quality: 1,
      });

      const source = result.assets;
      console.log(source);
      setImages(source)
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
        title,
        message: body,
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
  const handleTitleTextChange = (newText) => {
      if (newText.trim() === "")
          setIsTitleEmpty(true);
      else
          setIsTitleEmpty(false);

    setTitle(newText);
  };

  return !signIn ? (
    <NotLogInScreen />
  ) : (
      <ScrollView nestedScrollEnabled={ true }
      contentContainerStyle={styleSheet.postingContainer}
    >
        {/* title text input */ }
        
        <TextInput
          style={ [styleSheet.titleTextInputStyle] }
                      placeholder="Report a crime"                
                      value={ title }
                      onChangeText={ handleTitleTextChange }
                      multiline={ true }
          autoFocus={ true }
          underlineColorColor="transparent"
                      activeUnderlineColor={ outlinedColor.color }
        />
        {/* <TextInput
          style={[styleSheet.bodyTextInputStyle, {height: height, backgroundColor:'red'} ]}
          placeholder="Body"
          value={body}
          onChangeText={setBody}
                      multiline={ true }
                      activeUnderlineColor={ outlinedColor.color }
                      /> */}
        { images.length > 0 && (

          <FlatList horizontal data={ images } keyExtractor={ (item) => item.uri } style={ { width: width, height: 200} }
            renderItem={ ({ item }) => (<View><Image source={ { uri: item.uri } } style={ { width:width , height: 200 } } /></View>) } />
      
                  ) }

        {/* add post and share buttons */ }
        <Appbar safeAreaInsets={ bottom } style={ [{ width: '100%', height: bottom + 30, borderTopWidth: 0.1, borderColor: outlinedColor }, backgroundColor] }>
                  <Appbar.Action icon="plus"/>
                  <Appbar.Action icon='share' onPress={ onShare } />
                  <Appbar.Action icon='image' onPress={selectPhoto}/>
              </Appbar>
    </ScrollView>
  );
};

export default AddPostScreen;
