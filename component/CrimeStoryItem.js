import { ref, getDownloadURL } from "firebase/storage";
import { Text, Card, Avatar, IconButton } from "react-native-paper";
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
import { LogInDialog } from "./AlertDialog";
import {
  getCountSuffix,
  getTimePassing,
  updateVoteCount,
  getVoteState,
  updateVoters,
  getRealTimeUpdate,
} from "../functions/voting";
import { retreivePhotoFromFirebaseStorage, getUserData } from "../functions/getCrimeStory";
import styleSheet from "../assets/StyleSheet";
import ImageView from "react-native-image-viewing";
import Icon from "react-native-vector-icons/Ionicons";
import EnumString from "../assets/EnumString";
import useStore from "../zustand/store";

//crime story component
const CrimeStoryItem = ({ postingData }) => {
  //current user info from useStore
  const { user: currentUser, signIn } = useStore((state) => state);

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

  //posting Data
  const { user: userDocRef } = postingData;
  const storyBody = `${postingData.story.substring(0, 31)}...`;
  const postingDateTime = postingData.postingDateTime.toDate();

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

  //to crime story detail screen
  const toCrimeDetail = () =>
    navigation.navigate("CrimeStoryStack", {
      screen: "CrimeDetail",
      params: {
         postingId: postingData.postingId,
        // postingData: {
        //   postingDateTime: postingData.postingDateTime,
        //   story: postingData.story,
        //   postingId: postingData.postingId,
        // },
        // photoUri,
        // userAvatarColor,
        // creator,
      },
    });

  // const toTest = () => {
  //   navigation.navigate("CrimeStoryStack", {
  //     screen: "Test",
  //     params: {
  //       postingData: {
  //         postingId: postingData.postingId,
  //       },
  //     },
  //   });
  // };

  //to log in screen
  const toLogInScreen = () =>
    navigation.navigate("SignInSignUp", { screen: "LogIn" });

  //retreive photos from firebase storage
  // const retreivePhotoFromFirebaseStorage = async () => {
  //   setPhotoUri([]);
  //   try {
  //     for (photo of postingData.photo) {
  //       const photoRef = ref(storage, photo);
  //       const source = await getDownloadURL(photoRef);

  //       setPhotoUri((pre) => [...pre, { uri: source }]);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  //increase or decrease the vote count
  // const updateVoteCount = async () => {
  //   try {
  //     !voteStatus
  //       ? await updateDoc(docRef, { upVote: upVoteCount + 1 })
  //       : await updateDoc(docRef, { upVote: upVoteCount - 1 });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  //Check whether the user has voted or not
  // const getVoteState = () => {
  //   const voteAlready = votersList.filter(
  //     (item) => item === currentUser.userId
  //   );

  //   //update the vote status
  //   voteAlready.length > 0 ? setVoteStatus(true) : setVoteStatus(false);
  // };

  //update the upVote count
  // const updateVoters = async () => {
  //   try {
  //     //if the vote state is false, add the current user id in the voters list in firestore
  //     if (!voteStatus) {
  //       await updateDoc(docRef, {
  //         voters: [...votersList, currentUser.userId],
  //       });
  //       setVoteStatus(true);
  //     }
  //     //else remove the user if from the voters list in firestore
  //     else {
  //       const voters = votersList.filter((item) => item !== currentUser.userId);
  //       await updateDoc(docRef, { voters });
  //       setVoteStatus(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  //get real time with firestore
  // const getRealTimeUpdate = () => {
  //   const collectionRef = collection(db, EnumString.postingCollection);
  //   const q = query(
  //     collectionRef,
  //     where("postingId", "==", postingData.postingId)
  //   );

  //   //add snapshot lister to the doc
  //   onSnapshot(q, (snapshot) => {
  //     snapshot.docChanges().forEach((change) => {
  //       setVoterslist(change.doc.data().voters);
  //       setUpVoteCount(change.doc.data().upVote);
  //     });
  //   });
  // };

  //get crime story publisher info
  // const getUserData = () => {
  //   onSnapshot(userDocRef, (snapshot) => {
  //     setUserAvatarColor(snapshot.data().preference.avatarColor);
  //     setCreator(snapshot.data().username);
  //   });
  // };

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
        </Card.Content>
        {/* story */}
        {postingData.story !== "" && (
          <Card.Content style={[styleSheet.margin_Vertical]}>
            <Text variant="titleMedium" style={textColor}>
              {storyBody}
            </Text>
          </Card.Content>
        )}
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
