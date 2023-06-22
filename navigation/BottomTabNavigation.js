import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import MapScreen from "../screen/MapScreen";
import ChartScreen from "../screen/Chart";
import AddPostScreen from "../screen/CrimeStory/AddPostScreen";
import styleSheet from "../assets/StyleSheet";
import AllCrimeStoriesScreen from "../screen/CrimeStory/AllCrimeStoriesScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigation = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: [{ display: "flex" }, null],
        tabBarActiveTintColor: styleSheet.highLightTextColor.color,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Chart") {
            iconName = "bar-chart";
          } else if (route.name === "Report") {
            iconName = "add";
          }
          else if (route.name === "AllCrimeStories") {
            iconName = "newspaper";
          }

          return <Icon name={iconName} color={color} size={size} />;
        },
        tabBarStyle: {
          borderTopWidth: 1,
        },
      })}
    >
      {/* map screen */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      {/* chart screen */}
      <Tab.Screen
        name="Chart"
        component={ChartScreen}
        options={{ headerShown: false }}
      />
      {/* Crime Stories */}
      <Tab.Screen
        name="AllCrimeStories"
        component={AllCrimeStoriesScreen}
        options={{ headerShown: false }}
      />
      {/* add post screen */}
      <Tab.Screen
        name="Report"
        component={AddPostScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
