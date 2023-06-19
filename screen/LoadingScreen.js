import { SafeAreaView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import styleSheet from "../assets/StyleSheet";

//loading screen
const LoadingScreen = () => {
  return (
    <SafeAreaView style={[styleSheet.container, styleSheet.flex_1]}>
      <ActivityIndicator
        animating={true}
        color={styleSheet.highLightTextColor.color}
        size={"large"}
      />
    </SafeAreaView>
  );
};

export default LoadingScreen;
