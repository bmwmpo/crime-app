import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import AllCrimeStoriesScreen from "../screen/CrimeStory/AllCrimeStoriesScreen";
import CrimeStoryDetailScreen from "../screen/CrimeStory/CrimeStoryDetailScreen";
import styleSheet from "../assets/StyleSheet";

const Stack = createNativeStackNavigator();

const CrimeStoryStack = ({ navigation }) => {
  const isDarkMode = useTheme().dark === "dark";
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;

  const cancelPress = () =>
    navigation.navigate("BottomTabNavigation", { screen: "CrimeStories" });

  return (
    <Stack.Navigator initialRouteName="AllCrimeStories">
      <Stack.Screen
        name="AllCrimeStories"
        component={AllCrimeStoriesScreen}
        options={() => ({ headerShown: false })}
      />
      <Stack.Screen
        name="CrimeDetail"
        component={CrimeStoryDetailScreen}
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
    </Stack.Navigator>
  );
};

export default CrimeStoryStack;
