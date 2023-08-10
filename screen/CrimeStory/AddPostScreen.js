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
import { TextInput, FAB, Button, Card, Appbar } from "react-native-paper";
import { FailDialog, SuccessDialog } from "../../component/AlertDialog";
import { useTheme } from "@react-navigation/native";
import { getLocationAddress, getUserCurrentLocation } from "../../functions/location";
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
const AddPostScreen = ({ navigation, route }) => {
  //current user infor from useStore
  const { user: currentUser, signIn, docID } = useStore((state) => state);
  //init toronto coordinate
  const torontoRegion = {
    latitude: 43.653225,
    longitude: -79.383186,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const fromLive = route.params?.item ? true : false;
  const liveCallData = route.params?.item.item;

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

  const handleUseCurrentLocation = () => setUseCurrentLocation((pre) => !pre);

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
    setIsStoryEmpty(true);
  };

  //update the coordinate and location address with device's current location
  const handleCurrentLocation = async () => {
    const coords = await getUserCurrentLocation(setInitRegion, setUseCurrentLocation, setShowFailDialog, setShowMapView);
    getLocationAddress(coords, setLocationAddress);
    setPinpointLocation(true);
  };

  //update the coordinate and location address with draggable maker
  const handleDraggableMaker = async (coords) => {
    try {
      const result = await Location.requestForegroundPermissionsAsync();

      if (result.status === "granted") {
        const draggableMarkerCoords = {
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setInitRegion(draggableMarkerCoords);
        getLocationAddress(draggableMarkerCoords, setLocationAddress);
        setPinpointLocation(true);
        setUseCurrentLocation(false);
      }
      //show failed dialog if permission denied
      else {
        setShowFailDialog(true);
        setShowMapView(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get Image from camera or gallery
  const handleImagePicker = (result) => {
    //photo taken by the camera or images from gallery
    const source = result.assets;

    if (source.length > 0) {
      const uri = source.map((item) => ({
        uri: item.uri,
        fileName: item.uri.substring(item.uri.lastIndexOf("/") + 1),
      }));
      setPhotoUri(uri);
    }
  };

  //handle open camera
  const openCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        setShowSuccessDialog(true);
        setDialogTitleMsg({ title: "", message: EnumString.permissionMsg });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
      });

      //cancel camera
      if (result.canceled) return;
      handleImagePicker(result);
    } catch (err) {
      console.log(err);
    }
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
      handleImagePicker(result);
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
        locationAddress: locationAddress,
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

  //call the useEffect when the route.params.item has changed
  useEffect(() => {
    const testFunc = async () => {
      try {
        setIsLoading(true);
        const result = await Location.requestForegroundPermissionsAsync();

        if (result.status === "granted") {
          const newRegion = {
            latitude: liveCallData.geometry.y,
            latitudeDelta: 0.01,
            longitude: liveCallData.geometry.x,
            longitudeDelta: 0.01,
          };

          getLocationAddress(newRegion, setLocationAddress);
          setInitRegion(newRegion);
          setPinpointLocation(true);
          setUseCurrentLocation(false);
          setIsStoryEmpty(false);
          setStory(
            `${liveCallData.CALL_TYPE} at ${liveCallData.CROSS_STREETS}`
          );
        }
        //show failed dialog if permission denied
        else {
          setShowFailDialog(true);
          setShowMapView(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }

      // if(route.params?.item.item.item.CALL_TYPE != null){

      //   obj= {"latitude": route.params?.item.item.item.geometry.x,  "longitude": route.params?.item.item.item.geometry.y, "latitudeDelta": 0.01, "longitudeDelta" : 0.01 }
      //   getLocationAddress(obj)

      //   setInitRegion(newRegion)
      // }
    };

    //if navigate from live call, call the set live call data function
    if (fromLive) {
      testFunc();
    }
  }, [liveCallData]);

  //update the location address if use current location is checked
  useEffect(() => {
    if (useCurrentLocation) handleCurrentLocation();
  }, [useCurrentLocation]);

  //reset all input fields when the user is logged out
  useEffect(() => {
    resetFields();
  }, [currentUser]);

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
        errorMessage={"Go to Setting -> Location and allow location permission"}
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
        handleDraggableMaker={handleDraggableMaker}
        useDraggableMaker={true}
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
            <Appbar.Action
              icon="image"
              onPress={selectPhoto}
              color={textColor.color}
            />
            {/*camera  */}
            <Appbar.Action
              icon="camera"
              onPress={openCamera}
              color={textColor.color}
            />
            {/* map */}
            <Appbar.Action
              icon="map"
              color={textColor.color}
              onPress={showHideMapView}
            />
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
              placeholder="Enter Report Here"
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
