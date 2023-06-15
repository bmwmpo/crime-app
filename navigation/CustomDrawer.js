import { DrawerContentScrollView } from "@react-navigation/drawer";
import { auth } from "../config/firebase_config";
import { signOut } from "firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";
import { View, SafeAreaView } from "react-native";
import { Drawer, Paragraph, Switch, Text, Avatar } from "react-native-paper";
import styleSheet from "../assets/StyleSheet";
import { useContext, useState } from "react";
import { useTheme } from "@react-navigation/native";
import UserContext from "../UserContext";
import { LogOutConfirmDialog } from "../screen/AlertDialog";

//custom drawer content
const CustomDrawer = ({ navigation, setIsDarkMode }) => {
  const [showDialog, setShowDialog] = useState(false);
  const isDarkMode = useTheme().dark;
  const currentUser = useContext(UserContext);
  const avatarLabel = currentUser.userProfile.username
    .toUpperCase()
    .substring(0, 1);

  const username = currentUser.userProfile.username;

  const hideDialog = () => setShowDialog(false);

  //sign out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);

      hideDialog();

      //show loading screen while signing out
      navigation.navigate("Loading");
    } catch (err) {
      console.log(err);
    } finally {
      //redirect to main screen upon successgul sign out
      setTimeout(() => {
        navigation.navigate("BottomTabNavigation", { screen: "Map" });
      }, 500);
    }
  };

  //sign out alert dialog
  const signOutAlert = () => setShowDialog(true);

  return (
    <DrawerContentScrollView contentContainerStyle={styleSheet.flex_1}>
      {!currentUser.signIn ? (
        //log in section
        <Drawer.Section>
          <Paragraph
            style={[
              styleSheet.drawerTextStyle,
              isDarkMode && styleSheet.textColor,
            ]}
          >
            Stay informed about neighborhood crime by joining the Toronto Crime
            Tracker
          </Paragraph>
          <Drawer.Item
            label={
              <Text style={isDarkMode && styleSheet.textColor}>
                Log in / Sign up
              </Text>
            }
            onPress={() =>
              navigation.navigate("SignInSignUp", { screen: "LogIn" })
            }
            icon={({ focused, color, size }) => (
              <Icon
                name="person-circle-outline"
                color={
                  isDarkMode
                    ? styleSheet.textColor.color
                    : styleSheet.lightModeColor.color
                }
                size={size}
              />
            )}
            rippleColor={styleSheet.highLightTextColor.color}
          />
        </Drawer.Section>
      ) : (
        <SafeAreaView style={styleSheet.flex_1}>
          {/* log out confirm dialog */}
          <LogOutConfirmDialog
            hideDialog={hideDialog}
            showDialog={showDialog}
            logOut={handleSignOut}
          />
          <View style={styleSheet.container}>
            <Avatar.Text size={90} label={avatarLabel} />
            <Text
              variant="titleSmall"
              style={[
                styleSheet.usernameStyle,
                isDarkMode && styleSheet.textColor,
              ]}
            >
              {username}
            </Text>
          </View>
          <View style={{ flex: 3, justifyContent: "space-between" }}>
            <Drawer.Section>
              <Drawer.Item
                label={
                  <Text style={isDarkMode && styleSheet.textColor}>
                    My Profile
                  </Text>
                }
                onPress={() => navigation.navigate("MyProfile")}
              />
              {/* Dark mode section */}
              <Text
                variant="titleSmall"
                style={[
                  styleSheet.drawerTextStyle,
                  isDarkMode && styleSheet.textColor,
                ]}
              >
                Perference
              </Text>
              <View style={styleSheet.drawerContainer}>
                <Icon
                  name="moon-outline"
                  size={20}
                  color={
                    isDarkMode
                      ? styleSheet.textColor.color
                      : styleSheet.lightModeColor.color
                  }
                />
                <Text
                  variant="labelLarge"
                  style={isDarkMode && styleSheet.textColor}
                >
                  Dark mode
                </Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={() => setIsDarkMode((pre) => !pre)}
                  color={styleSheet.highLightTextColor.color}
                />
              </View>
            </Drawer.Section>
          </View>

          {/* log out section */}
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Drawer.Section>
              <Drawer.Item
                label={
                  <Text
                    variant="labelLarge"
                    style={isDarkMode && styleSheet.textColor}
                  >
                    Log out
                  </Text>
                }
                onPress={signOutAlert}
                icon={({ focused, color, size }) => (
                  <Icon
                    name="log-out-outline"
                    color={styleSheet.logoutColor.color}
                    size={size}
                  />
                )}
                rippleColor={styleSheet.highLightTextColor.color}
              />
            </Drawer.Section>
          </View>
        </SafeAreaView>
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
