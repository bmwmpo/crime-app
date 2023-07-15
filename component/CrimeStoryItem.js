import { ref, getDownloadURL } from "firebase/storage";
import { Text, Card, Avatar, IconButton, Menu } from "react-native-paper";
import { useState, useEffect } from "react";
import { storage } from "../config/firebase_config";
import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { db } from "../config/firebase_config";
import {
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { ConfirmDialog, LogInDialog } from "./AlertDialog";
import {
  getCountSuffix,
  getTimePassing,
  updateVoteCount,
  getVoteState,
  updateVoters,
  getRealTimeUpdate,
} from "../functions/voting";
import {
  retreivePhotoFromFirebaseStorage,
  getUserData,
  deleteCrimeStory,
} from "../functions/getCrimeStory";
import styleSheet from "../assets/StyleSheet";
import ImageView from "react-native-image-viewing";
import Icon from "react-native-vector-icons/Ionicons";
import EnumString from "../assets/EnumString";
import useStore from "../zustand/store";

//crime story component
const CrimeStoryItem = ({ postingData, showMenu, setIsLoading }) => {
  //current user info from useStore
  const { user: currentUser, signIn, docID } = useStore((state) => state);

  //save the photo uri in an object {uri: }
  const [photoUri, setPhotoUri] = useState([]);
  const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });

  //state value
  const [upVoteCount, setUpVoteCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState(false);
  const [votersList, setVoterslist] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [userAvatarColor, setUserAvatarColor] = useState("#9400D3");
  const [creator, setCreator] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  //posting Data
  const { user: userDocRef } = postingData;
  const storyBody =
    !(postingData.story === "") && `${postingData.story.substring(0, 31)}...`;
  const postingDateTime = postingData.postingDateTime.toDate();
  const locationAddress = postingData.locationAddress;

  const docRef = doc(db, EnumString.postingCollection, postingData.postingId);

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
  const cardBorderColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor
    : styleSheet.lightModeOutlinedColor;

  const navigation = useNavigation();

  const hideDialog = () => setShowDialog(false);

  const hideConfirmDialog = () => setShowConfirmDialog(false);

  const openMenu = () => setMenuVisible(true);

  const hideMenu = () => setMenuVisible(false);

  //to crime story detail screen
  const toCrimeDetail = () =>
    navigation.navigate("CrimeStoryStack", {
      screen: "CrimeDetail",
      params: {
        postingId: postingData.postingId,
      },
    });

  //to log in screen
  const toLogInScreen = () =>
    navigation.navigate("SignInSignUp", { screen: "LogIn" });

  //trigger the upvote
  const onUpVote = () => {
    if (signIn) {
      updateVoteCount(voteStatus, upVoteCount, docRef);
      updateVoters(
        voteStatus,
        setVoteStatus,
        votersList,
        docRef,
        currentUser.userId
      );
    } else {
      setShowDialog(true);
    }
  };

  //delete crime story with the given id
  const handleDelete = async () => {
    setIsLoading(true);
    await deleteCrimeStory(postingData.postingId, docID);
    setIsLoading(false);
  };

  //retreive the photos when the page is first mounted
  //and get the real time udapte with firestore
  useEffect(() => {
    retreivePhotoFromFirebaseStorage(setPhotoUri, postingData);
    getRealTimeUpdate(postingData.postingId, setVoterslist, setUpVoteCount);
    getUserData(userDocRef, setUserAvatarColor, setCreator);
  }, []);

  //get the current user vote state
  useEffect(() => {
    getVoteState(votersList, setVoteStatus, currentUser.userId);
  }, [votersList, upVoteCount]);

  return (
    <TouchableOpacity onPress={toCrimeDetail}>
      <Card
        style={[
          styleSheet.flex_1,
          backgroundColor,
          styleSheet.padding_Vertical,
          styleSheet.padding_Horizontal,
          {
            borderColor: cardBorderColor.color,
            borderWidth: StyleSheet.hairlineWidth,
            justifyContent: "center",
          },
        ]}
      >
        {/* show the dialog if the user is not logged in */}
        <LogInDialog
          hideDialog={hideDialog}
          showDialog={showDialog}
          navigateToLogIn={toLogInScreen}
          message={EnumString.logInMsg}
          title={EnumString.logInTilte}
        />
        {/* confirm delete dialog */}
        <ConfirmDialog
          hideDialog={hideConfirmDialog}
          showDialog={showConfirmDialog}
          action={handleDelete}
          title={EnumString.deleteStoryTitle}
          msg={EnumString.deleteStoryMsg}
        />
        {/* image full screen */}
        <ImageView
          images={photoUri}
          imageIndex={showImageView.index}
          visible={showImageView.visible}
          onRequestClose={() =>
            setShowImageView((pre) => ({ ...pre, visible: false }))
          }
        />
        {/* posting info: author, date and time */}
        <Card.Content
          style={[
            styleSheet.flexRowContainer,
            styleSheet.flexSpaceBetweenStyle,
          ]}
        >
          {/* author */}
          <View>
            <Avatar.Text
              label={creator.substring(0, 1).toUpperCase()}
              size={30}
              style={{ backgroundColor: userAvatarColor }}
            />
          </View>
          {/* date and time */}
          <View style={[styleSheet.flexStartContainer]}>
            <Text
              variant="labelLarge"
              style={[
                styleSheet.margin_HorizontflexStartContaineral_right,
                textColor,
              ]}
            >
              {creator}
            </Text>
            <Text variant="labelLarge" style={textColor}>
              {postingDateTime.toLocaleString()}
            </Text>
          </View>
          {/* passing time */}
          <View>
            <Text variant="labelLarge" style={textColor}>
              {getTimePassing(postingDateTime)}
            </Text>
          </View>
          {/* menu button on available on Your Post screen*/}
          {showMenu && (
            <Menu
              visible={menuVisible}
              onDismiss={hideMenu}
              anchor={
                <IconButton
                  onPress={openMenu}
                  icon="dots-vertical"
                  textColor={textColor.color}
                ></IconButton>
              }
              anchorPosition="bottom"
            >
              <Menu.Item
                title="delete"
                onPress={() => {
                  setShowConfirmDialog(true);
                  hideMenu();
                }}
              />
            </Menu>
          )}
        </Card.Content>
        {/* story and crime scene location*/}
        <Card.Content style={[styleSheet.margin_Vertical]}>
          <Text variant="titleSmall" style={textColor}>
            {locationAddress}
          </Text>
          <Text variant="titleMedium" style={textColor}>
            {storyBody}
          </Text>
        </Card.Content>
        {/* Photo section */}
        {photoUri.length > 0 && (
          <Card.Content
            style={[styleSheet.container, styleSheet.margin_Vertical]}
          >
            <FlatList
              horizontal
              style={{ width: windowWidth * 0.9, height: windowHeight * 0.2 }}
              data={photoUri}
              keyExtractor={(item) => item.uri}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setShowImageView({ visible: true, index });
                  }}
                >
                  <Card.Cover
                    source={{ uri: item.uri }}
                    style={{
                      width: windowWidth * 0.9,
                      height: windowHeight * 0.2,
                    }}
                  />
                </Pressable>
              )}
            />
          </Card.Content>
        )}
        {/* vote section */}
        <Card.Content
          style={[styleSheet.flexRowContainer, { alignItems: "center" }]}
        >
          {voteStatus ? (
            <IconButton
              icon="thumb-up"
              iconColor={textColor.color}
              onPress={onUpVote}
            />
          ) : (
            <IconButton
              icon="thumb-up-outline"
              iconColor={textColor.color}
              onPress={onUpVote}
            />
          )}
          <Text variant="labelLarge" style={textColor}>
            {getCountSuffix(upVoteCount)}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default CrimeStoryItem;
