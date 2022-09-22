import React from "react";
import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "config/colors";

const TabButton = ({ active, icon }) => {
  return (
    <View className="flex-1 w-full justify-center items-center">
      {icon}
      {active && <Entypo name="dot-single" size={24} color={colors.primary} />}
    </View>
  );
};

export default TabButton;
