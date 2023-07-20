import { Card, Avatar, Text, IconButton, Menu } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { StyleSheet } from "react-native";
import { MemoizedCommentItem } from "./CommentItem";
import { getUserData, deleteComment } from "../functions/getCrimeStory";
import { ConfirmDialog } from "./AlertDialog";
import MenuComponent from "../component/MenuComponent";
import ItemHeader from "../component/ItemHeader";
import styleSheet from "../assets/StyleSheet";
import EnumString from "../assets/EnumString";
import useStore from "../zustand/store";

//user's comment component
const YourCommentsComponent = ({
  commentData,
  postingRef,
  setIsLoading,
}) => {
  //current user info from useStore
  const { docID } = useStore((state) => state);

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  const cardBorderColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor
    : styleSheet.lightModeOutlinedColor;

  //state values
  const [story, setStory] = useState("");
  const [postingDateTime, setPostingDateTime] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [creator, setCreator] = useState("");
  const [userAvatarColor, setUserAvatarColor] = useState("#9400D3");
  const [menuVisible, setMenuVisible] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isStoryDeleted, setIsStoryDeleted] = useState(false);

  const hideConfirmDialog = () => setShowConfirmDialog(false);

  const openMenu = () => setMenuVisible(true);

  const hideMenu = () => setMenuVisible(false);

  //handle delete comment
  const handleDelete = async () => {
    setIsLoading(true);
    await deleteComment(postingRef, commentData.commentId, docID);
    setTimeout(() => setIsLoading(false), 2000);
  };

  //retreive crime story data from firestore
  const getCrimeStoryData = async () => {
    try {
      const document = await getDoc(postingRef);

      if (document.exists()) {
        setIsStoryDeleted(false);
        setStory(document.data().story);
        setPostingDateTime(document.data().postingDateTime.toDate());
        setLocationAddress(document.data().locationAddress);
        getUserData(document.data().user, setUserAvatarColor, setCreator);
      } else {
        console.log("no document is found");
        setIsStoryDeleted(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCrimeStoryData();
  }, []);

  return (
    <Card
      style={[
        styleSheet.flex_1,
        backgroundColor,
        {
          borderColor: cardBorderColor.color,
          borderWidth: StyleSheet.hairlineWidth,
          justifyContent: "center",
        },
        styleSheet.padding_Horizontal,
        styleSheet.padding_Vertical,
      ]}
    >
      {/* confirm delete dialog */}
      <ConfirmDialog
        hideDialog={hideConfirmDialog}
        showDialog={showConfirmDialog}
        action={handleDelete}
        title={EnumString.deleteStoryTitle}
        msg={EnumString.deleteStoryMsg}
      />
      {/* posting info: author, date and time */}
      <Card.Content
        style={[styleSheet.flexRowContainer, styleSheet.flexSpaceBetweenStyle]}
      >
        {isStoryDeleted ? (
          <Card.Title
            title="deleted crime story"
            titleStyle={textColor}
            right={() => (
              <MenuComponent
                menuVisible={menuVisible}
                hideMenu={hideMenu}
                openMenu={openMenu}
                textColor={textColor}
                setShowConfirmDialog={setShowConfirmDialog}
              />
            )}
          />
        ) : (
          <ItemHeader
            creator={creator}
            userAvatarColor={userAvatarColor}
            postingDateTime={postingDateTime}
            menuVisible={menuVisible}
            hideMenu={hideMenu}
            openMenu={openMenu}
            showMenu={true}
            textColor={textColor}
            setShowConfirmDialog={setShowConfirmDialog}
          />
        )}
      </Card.Content>
      {/* story and crime scene location*/}
      {!isStoryDeleted && (
        <Card.Content style={[styleSheet.margin_Vertical]}>
          <Text
            variant="titleSmall"
            style={[textColor, styleSheet.margin_Vertical]}
          >
            {locationAddress}
          </Text>
          <Text variant="titleMedium" style={textColor}>
            {story}
          </Text>
        </Card.Content>
      )}
      {/* user comment */}
      <MemoizedCommentItem
        commentData={commentData}
        postingId={postingRef.id}
      />
    </Card>
  );
};

export default YourCommentsComponent;
