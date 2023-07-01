import { View } from "react-native";
import { List, Avatar, Text } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import styleSheet from "../../assets/StyleSheet";
import useStore from "../../zustand/store";
import ItemComponent from "../../component/ItemComponent";

//user account screen
const MyAccountScreen = ({ navigation }) => {
  const { user: currentUser } = useStore((state) => state);

  const avatarLabel = currentUser.username.toUpperCase().substring(0, 1);
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;

  const toEditProfileScreen = () => navigation.navigate("Edit Username");

  const toChangePasswordScreen = () => navigation.navigate("ChangePassword");

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styleSheet.container,
          { padding: "4%", borderBottomWidth: 1, borderColor: textColor.color },
        ]}
      >
        <Avatar.Text label={avatarLabel} size={80} />
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
      </List.Section>
    </View>
  );
};

export default MyAccountScreen;
