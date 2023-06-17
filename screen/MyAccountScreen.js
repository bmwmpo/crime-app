import { View } from "react-native";
import { List, Avatar, Text } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useContext } from "react";
import styleSheet from "../assets/StyleSheet";
import UserContext from "../UserContext";

const MyAccountScreen = ({ navigation }) => {
  const isDarkMode = useTheme().dark;
  const currentUser = useContext(UserContext);
  const avatarLabel = currentUser.userProfile.username
    .toUpperCase()
    .substring(0, 1);
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;

  const toEditProfileScreen = () => navigation.navigate("EditProfile");
  const toChangePasswordScreen = () => navigation.navigate("ChangePassword");
  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styleSheet.flexStartContainer,
          { padding: "4%", borderBottomWidth: 1, borderColor: textColor.color },
        ]}
      >
        <Avatar.Text label={avatarLabel} size={80} />
        <Text variant="titleLarge" style={[textColor]}>
          {currentUser.userProfile.username}
        </Text>
      </View>

      <List.Section style={{ padding: "4%", flex: 2 }}>
        <List.Subheader
          style={[textColor, styleSheet.textStyle, styleSheet.textFontSize]}
        >
          Setting
        </List.Subheader>
        <List.Item
          title="Edit Profile"
          titleStyle={textColor}
          left={() => <List.Icon icon="human" color={textColor.color} />}
          onPress={toEditProfileScreen}
          rippleColor={styleSheet.highLightTextColor.color}
        />
        <List.Item
          title="Change Password"
          titleStyle={textColor}
          titleEllipsizeMode="clip"
          left={() => <List.Icon icon="cog" color={textColor.color} />}
          onPress={toChangePasswordScreen}
          rippleColor={styleSheet.highLightTextColor.color}
        />
      </List.Section>
    </View>
  );
};

export default MyAccountScreen;
