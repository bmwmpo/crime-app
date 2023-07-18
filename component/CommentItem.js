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
import {
  getCountSuffix,
  getTimePassing,
  updateVoters,
  getVoteState,
  updateVoteCount,
  getRealTimeUpdate
} from "../functions/voting";
import { getUserData } from "../functions/getCrimeStory";
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

  useEffect(() => {
    getRealTimeUpdate(docRef, setVoterslist, setUpVoteCount);
    getUserData(userDocRef, setUserAvatarColor, setCreator);
  }, []);

  //get the current user vote state
  useEffect(() => {
    getVoteState(votersList, setVoteStatus, currentUser.userId);
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
