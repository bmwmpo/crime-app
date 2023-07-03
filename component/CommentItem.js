import { Card, Text, Avatar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { Dimensions, StyleSheet, View } from "react-native";
import { db } from "../config/firebase_config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styleSheet from "../assets/StyleSheet";
import EnumString from "../assets/EnumString";

const CommentItem = ({ commentData }) => {
  const [userAvatarColor, setUserAvatarColor] = useState("#9400D3");
  const replyDateTime = commentData.replyDateTime.toDate();
  const { comment, replyBy } = commentData;
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

  const getTimePassing = () => {
    const timePassingInHrs = (new Date() - replyDateTime) / 1000 / 60 / 60;

    if (timePassingInHrs > 24) {
      return `${Math.floor(timePassingInHrs / 24)}d`;
    } else if (timePassingInHrs < 1) {
      const timePassingInMin = timePassingInHrs * 60;
      return timePassingInMin > 1 ? `${Math.ceil(timePassingInMin)}m` : "now";
    } else {
      return `${Math.ceil(timePassingInHrs)}h`;
    }
  };

  //get user avatar color from firestore
  const getUserAvaterColor = async () => {
    const collectionRef = collection(db, EnumString.userInfoCollection);
    const filter = where("email", "==", commentData.userEmail);
    const q = query(collectionRef, filter);

    try {
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") 
             setUserAvatarColor(change.doc.data().preference.avatarColor);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() =>
  {
    getUserAvaterColor();
  },[]);

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
        {/* author */}
        <View>
          <Avatar.Text
            label={ commentData.replyBy.substring(0, 1).toUpperCase() }
            size={ 30 }
            style={ {backgroundColor:userAvatarColor} }
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
            {replyBy}
          </Text>
          <Text variant="labelLarge" style={textColor}>
            {replyDateTime.toLocaleString()}
          </Text>
        </View>
        {/* passing time */}
        <View>
          <Text variant="labelLarge" style={textColor}>
            {getTimePassing()}
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
    </Card>
  );
};

export default CommentItem;
