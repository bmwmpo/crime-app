import {
  View,
  ScrollView,
  Share,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useState, useRef } from "react";
import { db } from "../../config/firebase_config";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../../config/firebase_config";
import { ref, uploadBytes } from "firebase/storage";
import { TextInput, FAB, Button, Card, Text } from "react-native-paper";
import { FailDialog, SuccessDialog } from "../../component/AlertDialog";
import { useTheme } from "@react-navigation/native";
import useStore from "../../zustand/store";
import LoadingScreen from "../LoadingScreen";
import ImageView from "react-native-image-viewing";
import styleSheet from "../../assets/StyleSheet";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import NotLogInScreen from "../LogInSignUp/NotLogInScreen";
import EnumString from "../../assets/EnumString";

//create post screen
const AddPostScreen = ({ navigation }) => {
  const { user: currentUser, signIn } = useStore((state) => state);

  const [story, setStory] = useState("");
  const [isStoryEmpty, setIsStoryEmpty] = useState(true);
  const [photoUri, setPhotoUri] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFailDialog, setShowFailDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogTitleMsg, setDialogTitleMsg] = useState({});
  const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });

  //ref to manipulate the flastlist
  const flatListRef = useRef();

  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const hideFailedDialog = () => setShowFailDialog(false);

  const hideSucessDialog = () => setShowSuccessDialog(false);

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

      //pickup images from gallery
      const source = result.assets;

      if (source.length > 0) {
        //setImages(source);
        const uri = source.map((item) => ({
          uri: item.uri,
          fileName: item.uri.substring(item.uri.lastIndexOf("/") + 1),
        }));
        setPhotoUri(uri);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //upload images to firebase storage
  const uploadPhoto = async () => {
    try {
      for (const image of photoUri) {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const photoRef = ref(storage, image.fileName);

        await uploadBytes(photoRef, blob);
      }
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
      setIsLoading(true);
      //upload the phot in firebase storage
      uploadPhoto();

      //save the posting in firestore
      const collectionRef = collection(db, "Postings");

      const postingId = uuid.v4();

      const photo = photoUri.map((item) => item.fileName);

      const postingDateTime = new Date();

      const newPosting = {
        story:story.trim(),
        postingId,
        photo,
        postingDateTime,
        postBy: currentUser.username,
        userEmail: currentUser.email,
      };

      await addDoc(collectionRef, newPosting);

      //show success dialog
      setShowSuccessDialog(true);
      setDialogTitleMsg({
        title: "",
        message: EnumString.thankYouMsg,
      });
      setStory("");
      setPhotoUri([]);
      navigation.navigate("BottomTabNavigation", { screen: "Map" });
    } catch (err) {
      //show fail dialog
      setShowFailDialog(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  //handle the title text change and check whether the title is empty or not
  //disable the add posting button if the title is missing
  const handleStoryTextChange = (newText) => {
    if (newText.trim() === "") setIsStoryEmpty(true);
    else setIsStoryEmpty(false);

    setStory(newText);
  };

  //delete the selected image
  const deleteSelectedImage = (item, index) => {
    setPhotoUri((pre) => pre.filter((image) => image.uri !== item.uri));

    //scroll to the previous or next image of the flatlst 
    flatListRef.current.scrollToIndex({
      animated: false,
      index: index > 0 ? index - 1 : index,
    });
  };

  return !signIn ? (
    <NotLogInScreen />
  ) : isLoading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView style={[styleSheet.flex_1]}>
      {/* fail dialog */}
      <FailDialog
        showDialog={showFailDialog}
        hideDialog={hideFailedDialog}
        errorMessage={"Failed"}
      />
      {/* success dialog */}
      <SuccessDialog
        showDialog={showSuccessDialog}
        hideDialog={hideSucessDialog}
        title={dialogTitleMsg.title}
        message={dialogTitleMsg.message}
      />
      {/* full screen image view */}
      <ImageView
        images={photoUri}
        imageIndex={showImageView.index}
        visible={showImageView.visible}
        onRequestClose={() =>
          setShowImageView((pre) => ({ ...pre, visible: false }))
        }
      />
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
          {/* share, select images, and add post opyions */}
          <View style={[styleSheet.flexRowContainer, styleSheet.flexEndStyle]}>
            <FAB
              icon="image"
              size="small"
              variant="surface"
              style={styleSheet.margin_Horizontal_3}
              onPress={selectPhoto}
            />
            <FAB
              icon="share"
              size="small"
              variant="surface"
              style={styleSheet.margin_Horizontal_3}
              onPress={onShare}
            />
            <Card.Actions>
              <Button mode="contained" onPress={addPost}>
                Report
              </Button>
            </Card.Actions>
          </View>
          <ScrollView
            contentContainerStyle={[
              {
                paddingBottom: windowHeight * 0.05,
                width: windowWidth,
              },
              styleSheet.createPostScrollViewStyle,
            ]}
          >
            {/* story input */}
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
            {
              //images section
              photoUri && (
                <FlatList
                  horizontal
                  ref={flatListRef}
                  data={photoUri}
                  keyExtractor={(item) => item.uri}
                  style={{ width: windowWidth, height: windowHeight * 0.7 }}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-end",
                        paddingRight: windowWidth * 0.1,
                      }}
                    >
                      <FAB
                        icon="delete-empty"
                        style={{
                          zIndex: 2,
                          top: windowHeight * 0.06,
                          right: windowWidth * 0.05,
                        }}
                        size="small"
                        variant="surface"
                        onPress={() => deleteSelectedImage(item, index)}
                      />
                      <Pressable
                        onPress={() => {
                          setShowImageView({ visible: true, index });
                        }}
                      >
                        <Card.Cover
                          source={{ uri: item.uri }}
                          style={{
                            width: windowWidth * 0.9,
                            height: windowHeight * 0.6,
                            zIndex: 1,
                            borderRadius: 20,
                          }}
                        />
                      </Pressable>
                    </View>
                  )}
                />
              )
            }
          </ScrollView>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};

export default AddPostScreen;
