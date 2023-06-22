import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { COLORS, SIZES, FONTS } from "../constants";

const TextButton = ({
  label,
  customContainerstyle,
  customLabelstyle,
  onPress,
}) => {
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
      <Text style={{ color: COLORS.white, ...FONTS.h3, ...customLabelstyle }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
