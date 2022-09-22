import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import Animated, { Layout } from "react-native-reanimated";
import ConditionalError from "components/text/ConditionalError";

const DateInput = ({
  className = "",
  label = "",
  date = null,
  setDate = () => {},
  error,
  ...rest
}) => {
  const [active, setActive] = useState(false);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View className={`space-y-2 ${className}`} {...rest}>
      <Animated.Text
        layout={Layout.easing()}
        className={`text-text_primary text-lg font-bold ${
          error && "text-error"
        }`}
      >
        {label}
      </Animated.Text>
      <AnimatedTouchable
        layout={Layout.easing()}
        className={`flex flex-row items-center  ${
          error ? "border-error" : "border-secondary"
        } border-2 bg-tertiary rounded-xl p-3 space-x-2 justify-between`}
        onPress={() => setActive(true)}
      >
        <Text
          className={`font-medium ${
            date ? "text-black" : "text-text_secondary"
          }`}
        >
          {date ? moment(date).format("DD-MM-YYYY") : "dd-mm-yyyy"}
        </Text>
        <MaterialIcons name="date-range" size={18} color="grey" />
      </AnimatedTouchable>
      <ConditionalError error={error} />
      <DateTimePickerModal
        isVisible={active}
        onCancel={() => setActive(false)}
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setActive(false);
        }}
      />
    </View>
  );
};

export default DateInput;
