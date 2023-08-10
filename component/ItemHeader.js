import { View, Dimensions } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { getTimePassing } from "../functions/voting";
import styleSheet from "../assets/StyleSheet";
import MenuComponent from "./MenuComponent";

//custom crime story and comment item header
const ItemHeader = ({
  creator,
  userAvatarColor,
  postingDateTime,
  menuVisible,
  hideMenu,
  openMenu,
  showMenu,
  textColor,
  setShowConfirmDialog,
}) => {
  return (
    <View
      style={[
        styleSheet.flexRowContainer,
        styleSheet.alignCenter,
        styleSheet.width_100,
        styleSheet.flexSpaceBetweenStyle,
      ]}
    >
      {/* avatar */}
      <Avatar.Text
        label={creator.substring(0, 1).toUpperCase()}
        size={30}
        style={[{ backgroundColor: userAvatarColor }]}
      />
      <View
        style={[styleSheet.flexStartContainer, styleSheet.margin_Horizontal]}
      >
        {/* creator */}
        <Text
          variant="labelLarge"
          style={[
            styleSheet.margin_HorizontflexStartContaineral_right,
            textColor,
          ]}
        >
          {creator}
        </Text>
        {/* date and time */}
        <Text
          variant="labelLarge"
          style={[textColor, styleSheet.margin_Vertical]}
        >
          {postingDateTime.toLocaleString()}
        </Text>
      </View>
      {/* passing time */}
      <Text variant="labelLarge" style={[textColor]}>
        {getTimePassing(postingDateTime)}
      </Text>
      {/* menu */}
      {showMenu && (
        <MenuComponent
          menuVisible={menuVisible}
          hideMenu={hideMenu}
          openMenu={openMenu}
          textColor={textColor}
          setShowConfirmDialog={setShowConfirmDialog}
        />
      )}
    </View>
  );
};

export default ItemHeader;
