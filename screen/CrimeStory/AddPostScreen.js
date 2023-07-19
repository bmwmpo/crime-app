import {
  View,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { db } from "../../config/firebase_config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { storage } from "../../config/firebase_config";
import { ref, uploadBytes } from "firebase/storage";
import {
  TextInput,
  FAB,
  Button,
  Card,
  RadioButton,
  Text,
} from "react-native-paper";
import { FailDialog, SuccessDialog } from "../../component/AlertDialog";
import { useTheme } from "@react-navigation/native";
import { BottomSheet } from "@rneui/themed";
import MapView, { Marker } from "react-native-maps";
import useStore from "../../zustand/store";
import LoadingScreen from "../LoadingScreen";
import ImageView from "react-native-image-viewing";
import styleSheet from "../../assets/StyleSheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import uuid from "react-native-uuid";
import NotLogInScreen from "../LogInSignUp/NotLogInScreen";
import EnumString from "../../assets/EnumString";
import PopUpMap from "../../component/PopUpMap";

//create post screen
const AddPostScreen = ({ navigation }) => {
  //current user infor from useStore
  const { user: currentUser, signIn, docID } = useStore((state) => state);

  //init toronto coordinate
  const torontoRegion = {
    latitude: 43.653225,
    longitude: -79.383186,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  //state values
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
  const [showMapView, setShowMapView] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [initRegion, setInitRegion] = useState(torontoRegion);
  const [locationAddress, setLocationAddress] = useState(
    EnumString.initLocationAddress
  );
  const [pinpointLoction, setPinpointLocation] = useState(false);

  //ref to manipulate the flastlist
  const flatListRef = useRef();

  //styling
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

  const showHideMapView = () => setShowMapView(!showMapView);

  const handleUseCurrentLocation = () =>
    setUseCurrentLocation(!useCurrentLocation);

  //reset location address and coordinate
  const resetLocation = () => {
    setLocationAddress(EnumString.initLocationAddress);
    setInitRegion(torontoRegion);
    setPinpointLocation(false);
  };

  //reset all input fields
  const resetFields = () => {
    setStory("");
    setPhotoUri([]);
    resetLocation();
    setUseCurrentLocation(false);
  };

  //reverse thr coordinate to address
  const getLocationAddress = async (coords) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(coords);

      if (reverseGeocode.length > 0) {
        const matchedLocation = reverseGeocode[0];
        const address = `${matchedLocation.streetNumber} ${matchedLocation.street},  ${matchedLocation.city} ${matchedLocation.postalCode}`;
        setLocationAddress(address);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get device's current location
  const getUserCurrentLocation = async () => {
    try {
      const result = await Location.requestForegroundPermissionsAsync();

      if (result.status === "granted") {
        const location = await Location.getCurrentPositionAsync();

        const curentLocationCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setInitRegion(curentLocationCoords);

        return curentLocationCoords;
      }
    } catch (err) {
      console.log(err);
    }
  };

  //update the coordinate and location address with device's current location
  const handleCurrentLocation = async () => {
    const coords = await getUserCurrentLocation();
    getLocationAddress(coords);
    setPinpointLocation(true);
  };

  //update the coordinate and location address with draggable maker
  const handleDraggableMaker = (coords) => {
    const draggableMarkerCoords = {
      ...coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    setInitRegion(draggableMarkerCoords);
    getLocationAddress(draggableMarkerCoords);
    setPinpointLocation(true);
  };

  //select image from gallery
  const selectPhoto = async () => {
    try {
      //request image library permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      //if grant = false
      if (permissionResult.granted === false) {
        setShowSuccessDialog(true);
        setDialogTitleMsg({ title: "", message: EnumString.permissionMsg });
        return;
      }

      //open Image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      //cancel image selection
      if (result.canceled) return;

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

  //store the reference of the newly posted document in the user's "yourStory" list in firestore
  const addPostToUserStoryList = async (postingRef) => {
    const docRef = doc(db, EnumString.userInfoCollection, docID);
    try {
      await updateDoc(docRef, { yourStory: arrayUnion(postingRef) });
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
      const collectionRef = collection(db, EnumString.postingCollection);

      // const postingId = uuid.v4();

      const photo = photoUri.map((item) => item.fileName);

      const postingDateTime = new Date();

      //posting object
      const newPosting = {
        story: story.trim(),
        postingId: "",
        photo,
        postingDateTime,
        upVote: 0,
        voters: [],
        user: doc(db, EnumString.userInfoCollection, docID),
        locationAddress,
        coords: {
          latitude: initRegion.latitude,
          longitude: initRegion.longitude,
        },
      };

      //save the posting in forestore
      const docAdded = await addDoc(collectionRef, newPosting);

      const docRef = doc(db, EnumString.postingCollection, docAdded.id);

      //update the postinfId
      await updateDoc(docRef, { postingId: docAdded.id });

      await addPostToUserStoryList(docRef);

      //show success dialog
      setShowSuccessDialog(true);
      setDialogTitleMsg({
        title: "",
        message: EnumString.thankYouMsg,
      });

      //reset all fields
      resetFields();

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

  //update the location address
  useEffect(() => {
    if (useCurrentLocation) handleCurrentLocation();
    else resetLocation();
  }, [useCurrentLocation]);

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
      {/* popup map view */}
      <PopUpMap
        showMapView={showMapView}
        showHideMapView={showHideMapView}
        initRegion={initRegion}
        isRadioButton={true}
        useCurrentLocation={useCurrentLocation}
        handleUseCurrentLocation={handleUseCurrentLocation}
        isDraggable={true}
        handleDraggableMaker={handleDraggableMaker}
      />
      {/* screen body */}
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
            {/* image */}
            <FAB
              icon="image"
              size="small"
              variant="surface"
              style={styleSheet.margin_Horizontal_3}
              onPress={selectPhoto}
            />
            {/* map */}
            <Card.Actions>
              <Button mode="contained" icon="map" onPress={showHideMapView}>
                Map
              </Button>
            </Card.Actions>
            {/* report crime story button */}
            <Card.Actions>
              <Button
                mode="contained"
                disabled={!pinpointLoction || isStoryEmpty}
                onPress={addPost}
                style={
                  (!pinpointLoction || isStoryEmpty) && {
                    backgroundColor:
                      styleSheet.disabledButtonStyle.backgroundColor,
                  }
                }
              >
                Report
              </Button>
            </Card.Actions>
          </View>
          {/* location address text */}
          <Card.Title
            title={locationAddress}
            titleStyle={textColor}
            titleNumberOfLines={5}
          />
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
                      {/* delete image button */}
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
                        {/* imaage */}
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
