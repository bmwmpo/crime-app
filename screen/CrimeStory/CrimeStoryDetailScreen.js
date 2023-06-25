import {
  View,
  Dimensions,
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  Share,
} from "react-native";
import { useState, useEffect } from "react";
import { Text, Avatar, Appbar, Button } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { db } from "../../config/firebase_config";
import {
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  collection,
} from "firebase/firestore";
import { LogInDialog } from "../../component/AlertDialog";
import ImageView from "react-native-image-viewing";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";

const CrimeStoryDetailScreen = ({ route, navigation }) => {
  const { user: currentUser, signIn } = useStore((state) => state);

  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [showImageView, setShowImageView] = useState({
    visible: false,
    index: 0,
  });

  //posting data
  const { postBy, photo, postingDateTime, story, postingId } =
    route.params.postingData;
  const { photoUri } = route.params;

  const docRef = doc(db, EnumString.postingCollection, postingId);
  const dateAndTime = postingDateTime.toDate();
  const [upVoteCount, setUpVoteCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState(false);
  const [votersList, setVoterslist] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const toCommentScreen = () => navigation.navigate("Comment");

  //to log in screen
  const toLogInScreen = () =>
    navigation.navigate("SignInSignUp", { screen: "LogIn" });

  const hideDialog = () => setShowDialog(false);

  //increase or decrease the vote count
  const updateVoteCount = async () => {
    try {
      if (!voteStatus) {
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
      setVoteStatus(true);
    } else {
      setVoteStatus(false);
    }
  };

  //update the upVote count
  const updateVoters = async () => {
    try {
      //if the vote state is false, add the current user id in the voters list in firestore
      if (!voteStatus) {
        await updateDoc(docRef, {
          voters: [...votersList, currentUser.userId],
        });
        setVoteStatus(true);
      }
      //else remove the user if from the voters list in firestore
      else {
        const voters = votersList.filter((item) => item !== currentUser.userId);
        await updateDoc(docRef, { voters });
        setVoteStatus(false);
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
    const q = query(collectionRef, where("postingId", "==", postingId));

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
    getRealTimeUpdate();
  }, []);

  //get the current user vote state
  useEffect(() => {
    getVoteState();
  });

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

  return (
    <SafeAreaView
      style={[styleSheet.flex_1, styleSheet.container, backgroundColor]}
    >
      {/* show the dialog if the user is not logged in */}
      <LogInDialog
        hideDialog={hideDialog}
        showDialog={showDialog}
        navigateToLogIn={toLogInScreen}
        message={EnumString.logInMsg}
        title={EnumString.logInTilte}
      />
      {/* full image view */}
      <ImageView
        images={photoUri}
        imageIndex={showImageView.index}
        visible={showImageView.visible}
        onRequestClose={() =>
          setShowImageView((pre) => ({ ...pre, visible: false }))
        }
      />
      <ScrollView
        style={[
          { padding: "4%", width: windowWidth },
          styleSheet.margin_Vertical,
        ]}
        contentContainerStyle={styleSheet.flexStartContainer}
      >
        {/* posting information: author, posting date, and time */}
        <View
          style={[
            styleSheet.flexRowContainer,
            styleSheet.flexSpaceBetweenStyle,
            styleSheet.margin_Vertical,
            { width: windowWidth * 0.7 },
          ]}
        >
          <Avatar.Text label={postBy.substring(0, 1).toUpperCase()} size={45} />
          <Text variant="labelLarge" style={textColor}>
            {postBy}
          </Text>
          <Text variant="labelLarge" style={textColor}>
            {dateAndTime.toLocaleString()}
          </Text>
        </View>
        {/* story */}
        <Text
          variant="titleLarge"
          style={[textColor, styleSheet.margin_Vertical]}
        >
          {story}
        </Text>
        {/* photo section */}
        {photoUri.length > 0 && (
          <View style={[styleSheet.flex_1, styleSheet.container]}>
            <FlatList
              horizontal
              style={{ width: windowWidth, height: windowHeight * 0.7 }}
              data={photoUri}
              keyExtractor={(item) => item.uri}
              ItemSeparatorComponent={() => (
                <View style={{ paddingRight: windowWidth * 0.1 }}></View>
              )}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setShowImageView({ visible: true, index });
                  }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={{
                      width: windowWidth,
                      height: windowHeight * 0.7,
                    }}
                  />
                </Pressable>
              )}
            />
          </View>
        )}
      </ScrollView>
      {/* app bar */}
      <Appbar
        style={[
          styleSheet.width_100,
          { height: windowHeight * 0.06 },
          backgroundColor,
        ]}
      >
        {/* like */}
        {voteStatus ? (
          <Appbar.Action
            icon="thumb-up"
            color={textColor.color}
            onPress={onUpVote}
          />
        ) : (
          <Appbar.Action
            icon="thumb-up-outline"
            color={textColor.color}
            onPress={onUpVote}
          />
        )}

        <Text style={textColor}>{upVoteCount}</Text>
        {/* share */}
        <Appbar.Action icon="share" onPress={onShare} />
        {/* comment */}
        <View style={[styleSheet.flexEndStyle, styleSheet.width_100]}>
          <Button
            mode="contained"
            style={[styleSheet.margin_Horizontal]}
            onPress={toCommentScreen}
          >
            Add a comment
          </Button>
        </View>
      </Appbar>
    </SafeAreaView>
  );
};

export default CrimeStoryDetailScreen;
