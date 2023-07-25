import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  getStateFromPath,
} from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Pressable, Appearance, useColorScheme, View } from "react-native";
import {
  PaperProvider,
  Avatar,
  Card,
  RadioButton,
  Text,
} from "react-native-paper";
import { BottomSheet } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { db } from "../config/firebase_config";
import { doc, updateDoc } from "firebase/firestore";
import UserLogInSignUpStack from "../navigation/UserLogInSignUpStack";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import CustomDrawer from "../navigation/CustomDrawer";
import styleSheet from "../assets/StyleSheet";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingScreen from "../screen/LoadingScreen";
import AccountStack from "./AccountStack";
import useStore from "../zustand/store";
import CrimeStoryStack from "./CrimeStoryStack";
import EnumString from "../assets/EnumString";
import * as Linking from "expo-linking";
import YourPostCommentScreen from "../screen/UserPostComment/YourPostCommentScreen";

const Drawer = createDrawerNavigator();
const prefix = Linking.createURL("crimeapp://");

const DrawerNavigation = () => {
  //user Info from useStore
  const {
    user,
    signIn,
    docID,
    preference: { darkMode, avatarColor, autoDarkMode },
    setIsAutoDarkMode,
  } = useStore((state) => state);

  //get the system theme
  const systemTheme = useColorScheme();

  //state values
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  //const [useSystemSetting, setUseSystemSetting] = useState(autoDarkMode);

  const avatarLabel = user.username.toUpperCase().substring(0, 1);

  //styling
  const textColor = autoDarkMode
    ? systemTheme === "dark"
      ? styleSheet.textColor
      : styleSheet.lightModeColor
    : darkMode
    ? styleSheet.textColor
    : styleSheet.lightModeColor;

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        CrimeStoryStack: {
          screens: {
            CrimeDetail: "CrimeDetail/:postingId",
          },
        },
      },
    },
  };

  const showHideBottomSheet = () =>
    setIsBottomSheetVisible(!isBottomSheetVisible);

  //update user's prefernce in firestore
  const updateUserPreference = async (autoDarkMode) => {
    const docRef = doc(db, EnumString.userInfoCollection, docID);
    try {
      await updateDoc(docRef, {
        preference: { darkMode, avatarColor, autoDarkMode },
      });
    } catch (err) {
      console.log(err);
    }
  };

  //handle use system theme
  const handleAutoDarkMode = () => {
    const isAutoDarkMode = !autoDarkMode;
    //update the user preference in useStore
    setIsAutoDarkMode(isAutoDarkMode);
    //update the user preference in firestore
    updateUserPreference(isAutoDarkMode);
  };

  return (
    <PaperProvider>
      <StatusBar
        style={
          autoDarkMode
            ? systemTheme === "dark"
              ? "light"
              : "dark"
            : darkMode
            ? "light"
            : "dark"
        }
      />
      {/* bottom sheet  */}
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onBackdropPress={showHideBottomSheet}
      >
        <Card
          style={[styleSheet.padding_Horizontal, styleSheet.padding_Vertical]}
        >
          <Text variant="labelLarge">Auto Dark Mode</Text>
          <View style={[styleSheet.flexRowContainer, styleSheet.alignCenter]}>
            <RadioButton
              value={false}
              status={!autoDarkMode ? "checked" : "unchecked"}
              onPress={handleAutoDarkMode}
            />
            <Text variant="labelLarge">Off</Text>
          </View>
          <View style={[styleSheet.flexRowContainer, styleSheet.alignCenter]}>
            <RadioButton
              value={true}
              status={autoDarkMode ? "checked" : "unchecked"}
              onPress={handleAutoDarkMode}
            />
            <Text variant="labelLarge">Use system setting</Text>
          </View>
        </Card>
      </BottomSheet>
      {/* navigation container */}
      <NavigationContainer
        theme={
          autoDarkMode
            ? systemTheme === "dark"
              ? DarkTheme
              : DefaultTheme
            : darkMode
            ? DarkTheme
            : DefaultTheme
        }
        linking={linking}
      >
        <Drawer.Navigator
          initialRouteName="BottomTabNavigation"
          screenOptions={({ navigation }) => ({
            headerTitle: "Toronto Crime Tracker",
            drawerStyle: { width: "65%" },
            headerStyle: { borderBottomWidth: 1 },
            headerTitleAlign: "center",
            headerLeft: () => (
              <Pressable onPress={() => navigation.toggleDrawer()}>
                {
                  //display avatar if user is logged in
                  signIn ? (
                    <Avatar.Text
                      label={avatarLabel}
                      style={[
                        styleSheet.margin_Horizontal,
                        { backgroundColor: avatarColor },
                      ]}
                      size={30}
                    />
                  ) : (
                    <Icon
                      style={styleSheet.margin_Horizontal}
                      name="person-circle-outline"
                      color={textColor.color}
                      size={30}
                    />
                  )
                }
              </Pressable>
            ),
          })}
          drawerContent={(props) => (
            <CustomDrawer
              {...props}
              setVisible={showHideBottomSheet}
              useSystemSetting={autoDarkMode}
            />
          )}
        >
          {/* bottomTabNavigation */}
          <Drawer.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
          />
          {/* userLogInSigUpStack */}
          <Drawer.Screen
            name="SignInSignUp"
            component={UserLogInSignUpStack}
            options={{ headerShown: false }}
          />
          {/* loading screen */}
          <Drawer.Screen name="Loading" component={LoadingScreen} />
          {/* accountStack */}
          <Drawer.Screen
            name="Account"
            component={AccountStack}
            options={{ headerShown: false }}
          />
          <Drawer.Screen
            name="CrimeStoryStack"
            component={CrimeStoryStack}
            options={{ headerShown: false }}
          />
          <Drawer.Screen
            name="YourPostComment"
            component={YourPostCommentScreen}
            options={{ headerShown: false }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default DrawerNavigation;
