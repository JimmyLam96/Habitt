import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, Text, View } from "react-native";

const Checkbox = ({
  className = "",
  value = false,
  onPress = () => {},
  label = null,
  disabled = false,
  ...rest
}) => {
  return (
    <View
      className={`${className} flex flex-row ${
        label && "space-x-2"
      } items-center`}
      {...rest}
    >
      <TouchableOpacity
        className={`flex justify-center items-center w-6 h-6 border-secondary rounded-full ${
          value ? "bg-highlight_primary" : "border-2"
        }`}
        disabled={disabled}
        onPress={onPress}
        delayPressIn={0}
      >
        {value === true && <Entypo name="check" size={18} color="white" />}
      </TouchableOpacity>
      {label !== null ? <Text className="font-medium">{label}</Text> : <></>}
    </View>
  );
};

export default Checkbox;
