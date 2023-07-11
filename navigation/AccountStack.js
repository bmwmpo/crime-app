import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import MyAccountScreen from "../screen/UserProfile/MyAccountScreen";
import styleSheet from "../assets/StyleSheet";
import ChangePasswordScreen from "../screen/UserProfile/ChangePasswordScreen";
import EditUsernameScreen from "../screen/UserProfile/EditUsernameScreen";
import EditAvatarScreen from "../screen/UserProfile/EditAvatarScreen";

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
      <Stack.Screen name="EditUsername" component={EditUsernameScreen} />
      <Stack.Screen name="ChangePassword" component={ ChangePasswordScreen } />
      <Stack.Screen name='EditAvatar' component={ EditAvatarScreen } />
    </Stack.Navigator>
  );
};

export default AccountStack;
