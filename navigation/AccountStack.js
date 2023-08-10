import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import MyAccountScreen from "../screen/UserProfile/MyAccountScreen";
import styleSheet from "../assets/StyleSheet";
import ChangePasswordScreen from "../screen/UserProfile/ChangePasswordScreen";
import EditUsernameScreen from "../screen/UserProfile/EditUsernameScreen";
import EditAvatarScreen from "../screen/UserProfile/EditAvatarScreen";
import LocationScreen from "../screen/UserProfile/LocationScreen";

const Stack = createNativeStackNavigator();

const AccountStack = ({ navigation }) => {
  const cancelPress = () => navigation.navigate("BottomTabNavigation");
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;

  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={() => ({
        headerTitleAlign: "center",
      })}
    >
      {/* MyAccount screen */}
      <Stack.Screen
        name="MyAccount"
        component={MyAccountScreen}
        options={({ route }) => ({
          headerLeft: () => (
            <Pressable onPress={cancelPress}>
              <Icon name="arrow-back" size={23} color={textColor.color} />
            </Pressable>
          ),
          headerTitle: "Account",
        })}
      />
      {/* EditUsername screen */}
      <Stack.Screen name="EditUsername" component={EditUsernameScreen} />
      {/* ChangePassword screen */}
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      {/* EditAvatar screen */}
      <Stack.Screen name="EditAvatar" component={EditAvatarScreen} />
      <Stack.Screen name="UpdateLocation" component={LocationScreen} />
    </Stack.Navigator>
  );
};

export default AccountStack;
