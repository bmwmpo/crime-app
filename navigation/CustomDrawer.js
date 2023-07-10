import { DrawerContentScrollView } from "@react-navigation/drawer";
import { auth } from "../config/firebase_config";
import { signOut } from "firebase/auth";
import { View, SafeAreaView } from "react-native";
import { Drawer, Paragraph, Switch, Text, Avatar } from "react-native-paper";
import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { LogOutConfirmDialog } from "../component/AlertDialog";
import { db } from "../config/firebase_config";
import { doc, updateDoc } from "firebase/firestore";
import Toast from "react-native-root-toast";
import useStore from "../zustand/store";
import styleSheet from "../assets/StyleSheet";
import Icon from "react-native-vector-icons/Ionicons";
import EnumString from "../assets/EnumString";

//custom drawer content
const CustomDrawer = ({ navigation, setVisible, useSystemSetting }) => {
  const [showDialog, setShowDialog] = useState(false);
  const isDarkMode = useTheme().dark;
  //dark mode or light mode text and icon color style object
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const {
    user: currentUser,
    signIn,
    setIsDarkMode,
    preference: { darkMode, avatarColor, autoDarkMode },
    docID,
  } = useStore((state) => state);

  const avatarLabel = currentUser.username.toUpperCase().substring(0, 1);

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
      //display toast with log out message
      Toast.show("You have successfully log out", {
        duration: Toast.durations.SHORT,
      });
    }
  };

  //sign out alert dialog
  const signOutAlert = () => setShowDialog(true);

  //update user's prefernce in firestore
  const upDateUserPreference = async (darkMode) => {
    try {
      const docRef = doc(db, EnumString.userInfoCollection, docID);
      await updateDoc(docRef, { preference: { darkMode, avatarColor, autoDarkMode } });
    } catch (err) {
      console.log(err);
    }
  };

  //handle DarkMode switch
  const handleSwitch = () => {
    const newPerfenenceDarkMode = !darkMode;
    //update the user preference in useStore
    setIsDarkMode(newPerfenenceDarkMode);
    //update the user preference in firestore
    upDateUserPreference(newPerfenenceDarkMode);
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styleSheet.flex_1}>
      {!signIn ? (
        //no logged in user
        //log in section
        <Drawer.Section>
          <Paragraph style={[styleSheet.drawerTextStyle, textColor]}>
            Stay informed about neighborhood crime by joining the Toronto Crime
            Tracker
          </Paragraph>
          <Drawer.Item
            label={<Text style={textColor}>Log in / Sign up</Text>}
            onPress={() =>
              navigation.navigate("SignInSignUp", { screen: "LogIn" })
            }
            icon={({ focused, color, size }) => (
              <Icon
                name="person-circle-outline"
                color={textColor.color}
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
            <Avatar.Text
              size={90}
              label={avatarLabel}
              style={{ backgroundColor: avatarColor }}
            />
            <Text
              variant="titleSmall"
              style={[styleSheet.margin_Vertical, textColor]}
            >
              {currentUser.username}
            </Text>
          </View>
          {/* drawer item */}
          <View style={styleSheet.drawerOptionsStyle}>
            <Drawer.Section>
              <Drawer.Item
                label={<Text style={textColor}>Account</Text>}
                onPress={() => navigation.navigate("Account")}
                icon={({ focused, color, size }) => (
                  <Icon
                    name="person"
                    color={textColor.color}
                    size={size}
                    style={{ marginRight: 5 }}
                  />
                )}
                rippleColor={styleSheet.highLightTextColor.color}
              />
              {/* Dark mode section */}
              <Text
                variant="titleSmall"
                style={[styleSheet.drawerTextStyle, textColor]}
              >
                Preference
              </Text>
              <View>
                <Drawer.Item
                  label={<Text style={textColor}>Auto Dark Mode</Text>}
                  icon={({ focused, color, size }) => (
                    <Icon
                      name="cog"
                      color={textColor.color}
                      size={size}
                      style={{ marginRight: 5 }}
                    />
                  ) }
                    onPress={ setVisible }
                  rippleColor={styleSheet.highLightTextColor.color}
                />
                <Drawer.Item
                  label={<Text style={textColor}>Dark mode</Text>}
                  icon={({ focused, color, size }) => (
                    <Icon
                      name="moon"
                      color={textColor.color}
                      size={size}
                      style={{ marginRight: 5 }}
                    />
                  )}
                    right={ () => (
                    //Disble the switch if useSystemSetting is true
                    <Switch
                      value={darkMode}
                      onValueChange={handleSwitch}
                      color={ styleSheet.highLightTextColor.color }
                      disabled={useSystemSetting}
                    />
                  )}
                />
              </View>
            </Drawer.Section>
          </View>
          {/* log out section */}
          <View style={styleSheet.drawerBottomStyle}>
            <Drawer.Section>
              <Drawer.Item
                label={
                  <Text variant="labelLarge" style={textColor}>
                    Log out
                  </Text>
                }
                onPress={signOutAlert}
                icon={({ focused, color, size }) => (
                  <Icon
                    name="log-out-outline"
                    color={styleSheet.errorTextStyle.color}
                    size={size}
                  />
                )}
                rippleColor={"red"}
              />
            </Drawer.Section>
          </View>
        </SafeAreaView>
      ) }
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
