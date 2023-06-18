import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import UserLogInSignUpStack from "../navigation/UserLogInSignUpStack";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import CustomDrawer from "../navigation/CustomDrawer";
import styleSheet from "../assets/StyleSheet";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingScreen from "../screen/LoadingScreen";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { PaperProvider, Avatar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import AccountStack from "./AccountStack";
import useStore from "../zustand/store";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () =>
{
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, signIn } = useStore(state=>state)
  const avatarLabel = user.username
    .toUpperCase()
    .substring(0, 1);
  
  return (
    <PaperProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator
          initialRouteName="BottomTabNavigation"
          screenOptions={({ navigation }) => ({
            headerTitle: "",
            drawerStyle: { width: "70%" },
            headerStyle: { borderBottomWidth: 1 },
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.toggleDrawer()}
              >
                {
                  //display avatar if user is logged in
                  signIn ? (
                    <Avatar.Text label={avatarLabel} size={30} />
                  ) : (
                    <Icon
                      name="person-circle-outline"
                      color={
                        isDarkMode
                          ? styleSheet.textColor.color
                          : styleSheet.lightModeColor.color
                      }
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
          <Drawer.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
          />
          <Drawer.Screen
            name="SignInSignUp"
            component={UserLogInSignUpStack}
            options={{ headerShown: false }}
          />
          <Drawer.Screen name="Loading" component={LoadingScreen} />
          <Drawer.Screen name="Account" component={AccountStack} options={{ headerShown: false }}/>
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default DrawerNavigation;
