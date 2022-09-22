import { View } from "react-native";
import React from "react";

const AddHabitButton = ({ children }) => {
  return (
    <View className="flex-1 w-full items-center justify-center">
      <View className="flex justify-center items-center bg-highlight_primary rounded-full p-3 shadow-lg">
        {children}
      </View>
    </View>
  );
};

export default AddHabitButton;
