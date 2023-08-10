import { View } from "react-native";
import { List, Avatar, Text } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";
import ItemComponent from "../../component/ItemComponent";
import LocationScreen from "../UserProfile/LocationScreen";

//user account screen
const MyAccountScreen = ({ navigation }) => {
  //current user info
  const {
    user: currentUser,
    preference: { avatarColor },
  } = useStore((state) => state);

  const avatarLabel = currentUser.username.toUpperCase().substring(0, 1);

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;

  const toEditProfileScreen = () => navigation.navigate("EditUsername");

  const toChangePasswordScreen = () => navigation.navigate("ChangePassword");

  const toEditAvatarScreen = () => navigation.navigate("EditAvatar");

  const toLocationScreen = () => navigation.navigate("UpdateLocation");

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styleSheet.container,
          { padding: "4%", borderBottomWidth: 1, borderColor: textColor.color },
        ]}
      >
        <Avatar.Text
          label={avatarLabel}
          size={80}
          style={{ backgroundColor: avatarColor }}
        />
      </View>
      <List.Section style={{ padding: "4%", flex: 2 }}>
        <List.Subheader
          style={[textColor, styleSheet.textStyle, styleSheet.textFontSize]}
        >
          Edit Profile
        </List.Subheader>
        {/* edit username screen */}
        <List.Item
          title="Username"
          titleStyle={textColor}
          left={() => <List.Icon icon="rename-box" color={textColor.color} />}
          right={() => (
            <ItemComponent title={currentUser.username} textColor={textColor} />
          )}
          onPress={toEditProfileScreen}
          rippleColor={styleSheet.highLightTextColor.color}
        />
        {/* change password screen */}
        <List.Item
          title="Change Password"
          titleStyle={textColor}
          titleEllipsizeMode="clip"
          left={() => <List.Icon icon="cog" color={textColor.color} />}
          right={() => <ItemComponent textColor={textColor} />}
          onPress={toChangePasswordScreen}
          rippleColor={styleSheet.highLightTextColor.color}
        />
        {/* edit avatar */}
        <List.Item
          title="Edit Avatar"
          titleStyle={textColor}
          titleEllipsizeMode="clip"
          left={() => (
            <List.Icon icon="square-edit-outline" color={textColor.color} />
          )}
          right={() => <ItemComponent textColor={textColor} />}
          onPress={toEditAvatarScreen}
          rippleColor={styleSheet.highLightTextColor.color}
        />
        {/* update location */}
        <List.Item
          title="Update Location"
          titleStyle={textColor}
          titleEllipsizeMode="clip"
          left={() => <List.Icon icon="pin" color={textColor.color} />}
          right={() => <ItemComponent textColor={textColor} />}
          onPress={toLocationScreen}
          rippleColor={styleSheet.highLightTextColor.color}
        />
      </List.Section>
    </View>
  );
};

export default MyAccountScreen;
