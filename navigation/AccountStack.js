import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import MyAccountScreen from "../screen/MyAccountScreen";
import styleSheet from "../assets/StyleSheet";
import ChangeUsernameScreen from "../screen/ChangeUsernameScreen";
import ChangePasswordScreen from "../screen/ChangePasswordScreen";

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
              <Icon name="arrow-back" size={30} color={textColor.color} />
            </Pressable>
          ),
          headerTitle: "Account",
              }) }
          />
          <Stack.Screen name="Edit Username" component={ ChangeUsernameScreen } />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
    </Stack.Navigator>
  );
};

export default AccountStack;
