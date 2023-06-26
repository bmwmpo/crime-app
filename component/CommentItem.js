import { Card, Text, Avatar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { Dimensions, StyleSheet, View } from "react-native";
import styleSheet from "../assets/StyleSheet";

const CommentItem = ({ commentData }) => {
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
      ]}
    >
      <Card.Content
        style={[styleSheet.flexRowContainer, styleSheet.flexSpaceBetweenStyle]}
      >
        {/* author */}
        <View>
          <Avatar.Text
            label={commentData.replyBy.substring(0, 1).toUpperCase()}
            size={30}
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
      {comment !== "" && (
        <Card.Content style={[styleSheet.margin_Vertical]}>
          <Text variant="titleMedium" style={textColor}>
            {comment}
          </Text>
        </Card.Content>
      )}
    </Card>
  );
};

export default CommentItem;
