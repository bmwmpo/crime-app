import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native-paper";
import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import AllCrimeStoriesScreen from "../screen/CrimeStory/AllCrimeStoriesScreen";
import CrimeStoryDetailScreen from "../screen/CrimeStory/CrimeStoryDetailScreen";
import styleSheet from "../assets/StyleSheet";
import CommentScreen from "../screen/CrimeStory/CommentScreen";

const Stack = createNativeStackNavigator();

const CrimeStoryStack = ({ navigation }) => {
  const isDarkMode = useTheme().dark;
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
      <Stack.Screen
        name="Comment"
        component={CommentScreen}
        options={() => ({
          title: "",
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default CrimeStoryStack;
