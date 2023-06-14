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
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <PaperProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator
          initialRouteName="BottomTabNavigation"
          screenOptions={({ navigation }) => ({
            headerTitle: "",
            drawerStyle: { width: "60%" },
            headerStyle: { borderBottomWidth: 1 },
            headerLeft: () => (
              <Pressable>
                <Icon
                  name="list"
                  color={
                    isDarkMode
                      ? styleSheet.textColor.color
                      : styleSheet.lightModeColor.color
                  }
                  size={30}
                  style={{ marginHorizontal: "10%" }}
                  onPress={() => navigation.toggleDrawer()}
                />
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
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default DrawerNavigation;
