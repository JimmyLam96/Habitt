import { TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import colors from "config/colors";

const ReturnButton = ({ className, ...rest }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className={`flex self-start items-center rounded-full left-4 top-6 ${className}`}
      onPress={() => navigation.goBack()}
      {...rest}
    >
      <Entypo name="cross" size={36} color={colors.primary} />
    </TouchableOpacity>
  );
};

export default ReturnButton;
