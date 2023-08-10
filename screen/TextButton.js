import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { COLORS, SIZES, FONTS } from "../constants";
import { useTheme, useNavigation } from "@react-navigation/native";
import styleSheet from "../assets/StyleSheet";



const TextButton = ({
  label,
  customContainerstyle,
  customLabelstyle,
  onPress,
}) => {
  const isDarkMode = useTheme().dark;
  const textColor = isDarkMode
    ? styleSheet.darkModeColor
    : styleSheet.lightModeColor;
  const backgroundColor = isDarkMode
    ? styleSheet.darkModeBackGroundColor
    : styleSheet.lightModeBackGroundColor;
  const cardBorderColor = isDarkMode
    ? styleSheet.darkModeOutlinedColor
    : styleSheet.lightModeOutlinedColor;

  return (
    <TouchableOpacity
      style={{
        height: 45,
        width:80,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.green,
        ...customContainerstyle
      }}
      onPress={onPress}
    >
      <Text style={{ color: textColor.color, ...FONTS.h3, ...customLabelstyle }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
