import { Card, Text, Avatar, IconButton } from "react-native-paper";
import { useTheme, useNavigation } from "@react-navigation/native";
import { Dimensions, StyleSheet, View } from "react-native";
import { db } from "../config/firebase_config";
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState, memo } from "react";
import { LogInDialog } from "./AlertDialog";
import { getCountSuffix, getTimePassing } from "../functions/voting";
import styleSheet from "../assets/StyleSheet";
import EnumString from "../assets/EnumString";
import useStore from "../zustand/store";

//comment item component
const CommentItem = ({ commentData, postingId }) => {
  //current user info from useStore
  const { user: currentUser, signIn } = useStore((state) => state);

  //state values
  const [userAvatarColor, setUserAvatarColor] = useState("#9400D3");
  const [upVoteCount, setUpVoteCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState(false);
  const [votersList, setVoterslist] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [creator, setCreator] = useState("");

  //comment data
  const replyDateTime = commentData.replyDateTime.toDate();
  const { comment, commentId, user: userDocRef } = commentData;

  //document reference
  const docRef = doc(
    db,
    EnumString.postingCollection,
    postingId,
    EnumString.commentsSubCollection,
    commentId
  );

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

  //to log in screen
  const toLogInScreen = () =>
    navigation.navigate("SignInSignUp", { screen: "LogIn" });

  const hideDialog = () => setShowDialog(false);

  //increase or decrease the vote count
  const updateVoteCount = async () => {
    try {
      !voteStatus
        ? await updateDoc(docRef, { upVote: upVoteCount + 1 })
        : await updateDoc(docRef, { upVote: upVoteCount - 1 });
    } catch (err) {
      console.log(err);
    }
  };

  //Check whether the user has voted or not
  const getVoteState = () => {
    const voteAlready = votersList.filter(
      (item) => item === currentUser.userId
    );

    //update the vote status
    voteAlready.length > 0 ? setVoteStatus(true) : setVoteStatus(false);
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

  //access reat time comment creator info from firestore
  const getUserData = () => {
    onSnapshot(userDocRef, (snapshot) => {
      setUserAvatarColor(snapshot.data().preference.avatarColor);
      setCreator(snapshot.data().username);
    });
  };

  //get real time with firestore
  const getRealTimeUpdate = () => {
    const collectionRef = collection(
      db,
      EnumString.postingCollection,
      postingId,
      EnumString.commentsSubCollection
    );

    const q = query(collectionRef, where("commentId", "==", commentId));

    //add snapshot lister to the doc
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        setVoterslist(change.doc.data().voters);
        setUpVoteCount(change.doc.data().upVote);
      });
    });
  };

  useEffect(() => {
    getRealTimeUpdate();
    getUserData();
  }, []);

  //get the current user vote state
  useEffect(() => {
    getVoteState();
  }, [votersList, upVoteCount]);

  return (
    <Card
      style={[
        styleSheet.flex_1,
        backgroundColor,
        {
          borderColor: cardBorderColor.color,
          borderTopWidth: StyleSheet.hairlineWidth,
          justifyContent: "center",
        },
        styleSheet.padding_Horizontal,
      ]}
    >
      <Card.Content
        style={[styleSheet.flexRowContainer, styleSheet.flexSpaceBetweenStyle]}
      >
        {/* show the dialog if the user is not logged in */}
        <LogInDialog
          hideDialog={hideDialog}
          showDialog={showDialog}
          navigateToLogIn={toLogInScreen}
          message={EnumString.logInMsg}
          title={EnumString.logInTilte}
        />
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
            {replyDateTime.toLocaleString()}
          </Text>
        </View>
        {/* passing time */}
        <View>
          <Text variant="labelLarge" style={textColor}>
            {getTimePassing(replyDateTime)}
          </Text>
        </View>
      </Card.Content>
      {/* comment */}
      {comment !== "" && (
        <Card.Content style={[styleSheet.margin_Vertical]}>
          <Text
            variant="titleMedium"
            style={[textColor, styleSheet.padding_Horizontal]}
          >
            {comment}
          </Text>
        </Card.Content>
      )}
      {/* like button */}
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
  );
};

//re-render the comment only if the props has changed
export const MemoizedCommentItem = memo(CommentItem);
