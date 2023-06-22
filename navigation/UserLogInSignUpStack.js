import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "../screen/LogInSignUp/LogInScreen";
import SignUpScreen from "../screen/LogInSignUp/SignUpScreen";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import styleSheet from "../assets/StyleSheet";
import { useTheme } from "@react-navigation/native";
import NotLogInScreen from "../screen/LogInSignUp/NotLogInScreen";

const Stack = createNativeStackNavigator();

const UserLogInSignUpStack = ({ navigation, route }) => {
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;

  const cancelPress = () => navigation.navigate("BottomTabNavigation");

  return (
    <Stack.Navigator
      initialRouteName="LogIn"
      screenOptions={
        {
          //headerShown:false
        }
      }
    >
      {/* login screen */}
      <Stack.Screen
        name="LogIn"
        component={LogInScreen}
        options={({ route }) => ({
          headerLeft: () => (
            <Pressable onPress={cancelPress}>
              <Icon
                name="close-circle-outline"
                size={30}
                color={textColor.color}
              />
            </Pressable>
          ),
          headerTitle: "",
        })}
      />
      {/* signup screen */}
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen name="NotLogIn" component={NotLogInScreen} />
    </Stack.Navigator>
  );
};

export default UserLogInSignUpStack;
