import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { PaperProvider, Avatar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import UserLogInSignUpStack from "../navigation/UserLogInSignUpStack";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import CustomDrawer from "../navigation/CustomDrawer";
import styleSheet from "../assets/StyleSheet";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingScreen from "../screen/LoadingScreen";
import AccountStack from "./AccountStack";
import useStore from "../zustand/store";
import CrimeStoryStack from "./CrimeStoryStack";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, signIn } = useStore((state) => state);
  const avatarLabel = user.username.toUpperCase().substring(0, 1);
  const textColor = isDarkMode
    ? styleSheet.textColor
    : styleSheet.lightModeColor;

  return (
    <PaperProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
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
                      style={styleSheet.margin_Horizontal}
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
            <CustomDrawer {...props} setIsDarkMode={setIsDarkMode} />
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
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default DrawerNavigation;
