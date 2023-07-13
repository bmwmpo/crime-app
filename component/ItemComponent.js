import { View, Dimensions } from "react-native";
import { List, Text } from "react-native-paper";
import styleSheet from "../assets/StyleSheet";

//custom list item component 
const ItemComponent = ({ title, textColor }) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <View
      style={[
        styleSheet.flexRowContainer,
        { width: windowWidth * 0.3 },
        styleSheet.flexEndStyle,
      ]}
    >
      <Text variant="titleSmall" style={textColor}>
        {title}
      </Text>
      <List.Icon icon="arrow-right-box" color={textColor.color} />
    </View>
  );
};

export default ItemComponent;
