import { ref, getDownloadURL } from "firebase/storage";
import { Text, Card, Avatar, IconButton, Appbar } from "react-native-paper";
import { useState, useEffect, useMemo } from "react";
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
import { doc } from "firebase/firestore";
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
import { onShare } from "../functions/shareLink";
import ItemHeader from "./ItemHeader";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import styleSheet from "../assets/StyleSheet";
import ImageView from "react-native-image-viewing";
import EnumString from "../assets/EnumString";
import useStore from "../zustand/store";

//crime story component
const CrimeStoryItem = ({ postingData, showMenu, setIsLoading, showAdsStatus }) => {
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
  const { user: userDocRef, postingId } = postingData;
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

  const showAds = () => {
    const num = Math.ceil(Math.random() * 3);

    if (num === 3) return true;
    else return false;
  };

  const isShowAds = useMemo(() => showAds(), [1]);

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
    setTimeout(() => setIsLoading(false), 2000);
  };

  //retreive the photos when the page is first mounted
  //and get the real time udapte with firestore
  useEffect(() => {
    retreivePhotoFromFirebaseStorage(setPhotoUri, postingData);
    getRealTimeUpdate(docRef, setVoterslist, setUpVoteCount);
    getUserData(userDocRef, setUserAvatarColor, setCreator);
  }, []);

  //get the current user vote state
  useEffect(() => {
    getVoteState(votersList, setVoteStatus, currentUser.userId);
  }, [votersList, upVoteCount]);

  return (
    <View>
      <TouchableOpacity onPress={toCrimeDetail} style={[{ margin: "2%" }]}>
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
          style={[styleSheet.container, styleSheet.flexSpaceBetweenStyle]}
        >
          <ItemHeader
            creator={creator}
            userAvatarColor={userAvatarColor}
            postingDateTime={postingDateTime}
            menuVisible={menuVisible}
            hideMenu={hideMenu}
            openMenu={openMenu}
            showMenu={showMenu}
            textColor={textColor}
            setShowConfirmDialog={setShowConfirmDialog}
          />
        </Card.Content>
        {/* story and crime scene location*/}
        <Card.Content
          style={[styleSheet.margin_Vertical, styleSheet.flexStartContainer]}
        >
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
        {/* App bar */}
        <Appbar
          style={[
            styleSheet.width_100,
            { height: windowHeight * 0.06 },
            backgroundColor,
          ]}
        >
          {/* vote section */}
          <Appbar.Action
            icon={voteStatus ? "thumb-up" : "thumb-up-outline"}
            color={textColor.color}
            onPress={onUpVote}
          />
          <Text variant="labelLarge" style={textColor}>
            {getCountSuffix(upVoteCount)}
          </Text>
          <Appbar.Action
            icon="share"
            onPress={() => onShare(postingId)}
            color={textColor.color}
          />
        </Appbar>
      </Card>
      </TouchableOpacity>
      {isShowAds && showAdsStatus && (
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
            ,
            { margin: "2%" },
          ]}
        >
          <Card.Content>
            <BannerAd
              unitId={TestIds.BANNER}
              size={BannerAdSize.LARGE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

export default CrimeStoryItem;
