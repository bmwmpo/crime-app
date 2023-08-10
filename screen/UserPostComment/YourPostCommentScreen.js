import { SafeAreaView } from "react-native";
import { Appbar } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import styleSheet from "../../assets/StyleSheet";
import YourPostScreen from "./YourPostScreen";
import YourCommentScreen from "./YourCommentScreen";

//user's posts and Comments screen
const YourPostCommentScreen = ({ navigation }) => {
  //state values
  const [index, setIndex] = useState(0);

  //styling
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  const tabIndicatorBackgroundColor = isDarkMode
    ? styleSheet.lightModeBackGroundColor
    : styleSheet.darkModeBackGroundColor;

  return (
    <SafeAreaView style={[styleSheet.flex_1]}>
      {/* custom Appbar */}
      <Appbar.Header
        style={[styleSheet.flexSpaceBetweenStyle, backgroundColor]}
      >
        {/* back action */}
        <Appbar.BackAction
          onPress={() => navigation.navigate("BottomTabNavigation")}
          color={textColor.color}
        />
        <Appbar.Content
          title="Your Posts and Comments"
          color={textColor.color}
        />
      </Appbar.Header>
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={[tabIndicatorBackgroundColor]}
        dense
      >
        <Tab.Item title="Your Posts" titleStyle={textColor} />
        <Tab.Item title="Your Comments" titleStyle={textColor} />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={[styleSheet.width_100]}>
          <YourPostScreen />
        </TabView.Item>
        <TabView.Item style={[styleSheet.width_100]}>
          <YourCommentScreen />
        </TabView.Item>
      </TabView>
    </SafeAreaView>
  );
};

export default YourPostCommentScreen;
