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
  get,
  addDoc,
  doc,
  query,
  where,
  getDocs,
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
const LocationScreen = ({ navigation, route }) => {
  //current user infor from useStore
  const {
    user: currentUser,
    signIn,
    docID,
    location: { coords, enabled },
    setLocationCoords,
    setLocationEnabled,
  } = useStore((state) => state);
  //init toronto coordinate
  const torontoRegion = {
    latitude: 43.653225,
    longitude: -79.383186,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  //state values
  const [isLoading, setIsLoading] = useState(false);
  const [showFailDialog, setShowFailDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogTitleMsg, setDialogTitleMsg] = useState({});
  const [showMapView, setShowMapView] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [initRegion, setInitRegion] = useState(torontoRegion);
  const [locationAddress, setLocationAddress] = useState(
    EnumString.initLocationAddress
  );
  const [pinpointLocation, setPinpointLocation] = useState(false);

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

  const showHideMapView = () => setShowMapView(!showMapView);

  const handleUseCurrentLocation = () => setUseCurrentLocation((pre) => !pre);

  //reset location address and coordinate
  const resetLocation = () => {
    setLocationAddress(EnumString.initLocationAddress);
    setInitRegion(torontoRegion);
    setPinpointLocation(false);
    setUseCurrentLocation(false);
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

  //update push notification area
  const updateLocation = async () => {
    try {
      setIsLoading(true);

      // Collection reference
      const collectionRef = collection(db, EnumString.userInfoCollection);

      // Field and value to search for
      var fieldName = "userId";
      var searchValue = currentUser.userId;
      console.log(currentUser.userId);

      // Query documents based on the field value
      const q = query(collectionRef, where(fieldName, "==", searchValue));
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs;
      if (documents.length > 0) {
        // Assuming there's only one matching document
        var docRef = querySnapshot.docs[0].ref;

        // Update the document
        await updateDoc(docRef, {
          location: { coords: initRegion, enabled: true },
        });
        setLocationCoords(initRegion);
        setLocationEnabled(true);
        console.log("Document successfully updated:", doc.id);
      } else {
        console.log("No documents found with the specified field value.");
      }
    } catch (err) {
      //show fail dialog
      console.error(err);
      setShowFailDialog(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  //update the location address if use current location is checked
  useEffect(() => {
    if (useCurrentLocation) handleCurrentLocation();
  }, [useCurrentLocation]);

  //get user's notification area
  useEffect(() => {
    if (coords === null) {
      resetLocation();
    } else {
      getLocationAddress(coords, setLocationAddress);
      setInitRegion(coords);
    }
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
        <Card.Content
          style={[backgroundColor, styleSheet.height_100, styleSheet.width_100]}
        >
          {/* map */}
          <View style={[styleSheet.flexRowContainer, styleSheet.flexEndStyle]}>
            {/* map */}
            <Appbar.Action
              icon="map"
              color={textColor.color}
              onPress={showHideMapView}
            />
            {/* update push notification area */}
            <Card.Actions>
              <Button
                mode="contained"
                disabled={!pinpointLocation}
                onPress={updateLocation}
                style={
                  !pinpointLocation && {
                    backgroundColor:
                      styleSheet.disabledButtonStyle.backgroundColor,
                  }
                }
              >
                Update
              </Button>
            </Card.Actions>
          </View>
          {/* location address text */}
          <Card.Title
            title={locationAddress}
            titleStyle={textColor}
            titleNumberOfLines={5}
          />
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};

export default LocationScreen;
