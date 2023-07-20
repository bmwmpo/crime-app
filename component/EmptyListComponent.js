import { View } from "react-native";
import { Text } from "react-native-paper";
import styleSheet from "../assets/StyleSheet";

//Empty list 
const EmptyListComponent = ({ title, textColor }) => {
  return (
    <View style={[styleSheet.container, styleSheet.flex_1]}>
      <Text
        variant="headlineSmall"
        style={[
          styleSheet.padding_Vertical,
          textColor,
          { textAlign: "center" },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

export default EmptyListComponent;
