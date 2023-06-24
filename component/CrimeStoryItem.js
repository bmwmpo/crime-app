import { ref, getDownloadURL } from "firebase/storage";
import { Text, Card, Badge } from "react-native-paper";
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
} from "firebase/firestore";
import styleSheet from "../assets/StyleSheet";
import ImageView from "react-native-image-viewing";
import Icon from "react-native-vector-icons/Ionicons";
import EnumString from "../assets/EnumString";
import useStore from "../zustand/store";
import { LogInDialog } from "./AlertDialog";

//crime story component
const CrimeStoryItem = ({ postingData }) => {
  const { user: currentUser, signIn } = useStore((state) => state);

  //save the photo uri in an object {uri: }
  const [photoUri, setPhotoUri] = useState([]);
  const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });
  const [upVoteCount, setUpVoteCount] = useState(0);
  const [voteState, setVoteState] = useState(false);
  const [votersList, setVoterslist] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const docRef = doc(db, EnumString.postingCollection, postingData.postingId);
  const storyBody = `${postingData.story.substring(0, 31)}...`;
  const postingDateTime = postingData.postingDateTime.toDate();
  const navigation = useNavigation();
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

  const hideDialog = () => setShowDialog(false);

  //to crime story detail screen
  const toCrimeDetail = () =>
    navigation.navigate("CrimeStoryStack", {
      screen: "CrimeDetail",
      params: { postingData, photoUri },
    });

  //to log in screen
  const toLogInScreen = () =>
    navigation.navigate("SignInSignUp", { screen: "LogIn" });

  //get post time passing
  const getTimePassing = () => {
    const timePassingInHrs = (new Date() - postingDateTime) / 1000 / 60 / 60;

    if (timePassingInHrs > 24) {
      return `${Math.floor(timePassingInHrs / 24)}d`;
    } else if (timePassingInHrs < 1) {
      const timePassingInMin = timePassingInHrs * 60;
      return timePassingInMin > 1 ? `${Math.ceil(timePassingInMin)}m` : "now";
    } else {
      return `${Math.ceil(timePassingInHrs)}h`;
    }
  };

  //get the vote count suffix
  const getCount = () => {
    if (upVoteCount < 1000) return `${upVoteCount}`;
    if (upVoteCount >= 1000 && upVoteCount < 1000000)
      return `${upVoteCount / 1000}k`;
    if (upVoteCount >= 1000000) return `${upVoteCount / 1000000}m`;
  };

  //retreive photos from firebase storage
  const retreivePhotoFromFirebaseStorage = async () => {
    setPhotoUri([]);
    try {
      for (photo of postingData.photo) {
        const photoRef = ref(storage, photo);
        const source = await getDownloadURL(photoRef);

        setPhotoUri((pre) => [...pre, { uri: source }]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //increase or decrease the vote count
  const updateVoteCount = async () => {
    try {
      if (!voteState) {
        await updateDoc(docRef, { upVote: upVoteCount + 1 });
      } else {
        await updateDoc(docRef, { upVote: upVoteCount - 1 });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Check whether the user has voted or not
  const getVoteState = () => {
    const voteAlready = votersList.filter(
      (item) => item === currentUser.userId
    );

    if (voteAlready.length > 0) {
      setVoteState(true);
    } else {
      setVoteState(false);
    }
  };

  //update the upVote count
  const updateVoters = async () => {
    try {
      //if the vote state is false, add the current user id in the voters list in firestore
      if (!voteState) {
        await updateDoc(docRef, {
          voters: [...votersList, currentUser.userId],
        });
        setVoteState(true);
      }
      //else remove the user if from the voters list in firestore
      else {
        const voters = votersList.filter((item) => item !== currentUser.userId);
        await updateDoc(docRef, { voters });
        setVoteState(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //trigger the upvote
  const onUpVote = () => {
    if (signIn) {
      updateVoteCount();
      updateVoters();
    } else {
      setShowDialog(true);
    }
  };

  //get real time with firestore
  const getRealTimeUpdate = () => {
    const collectionRef = collection(db, EnumString.postingCollection);
    const q = query(
      collectionRef,
      where("postingId", "==", postingData.postingId)
    );

    //add snapshot lister to the doc
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        setVoterslist(change.doc.data().voters);
        setUpVoteCount(change.doc.data().upVote);
      });
    });
  };

  //retreive the photos when the page is first mounted
  //and get the real time udapte with firestore
  useEffect(() => {
    retreivePhotoFromFirebaseStorage();
    getRealTimeUpdate();
  }, []);

  //get the current user vote state
  useEffect(() => {
    getVoteState();
  }, [currentUser.userId]);

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
            <Badge>{postingData.postBy.substring(0, 1).toUpperCase()}</Badge>
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
              {postingData.postBy}
            </Text>
            <Text variant="labelLarge" style={textColor}>
              {postingDateTime.toLocaleString()}
            </Text>
          </View>
          {/* passing time */}
          <View>
            <Text variant="labelLarge" style={textColor}>
              {getTimePassing()}
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
          <Pressable
            onPress={onUpVote}
            style={styleSheet.margin_Horizontal_right}
          >
            {voteState ? (
              <Icon name="thumbs-up" size={25} color={textColor.color} />
            ) : (
              <Icon
                name="thumbs-up-outline"
                size={25}
                color={textColor.color}
              />
            )}
          </Pressable>

          <Text variant="labelLarge" style={textColor}>
            {getCount()}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default CrimeStoryItem;