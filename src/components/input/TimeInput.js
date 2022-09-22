import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import colors from "config/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import ConditionalError from "components/text/ConditionalError";

const TimeInput = ({
  className = "",
  label = "",
  value = null,
  setValue = (selectedTime = "") => {},
  minimumDate = undefined,
  placeholder = "00:00",
  error = undefined,
  ...rest
}) => {
  const [active, setActive] = useState(false);
  return (
    <View className={`space-y-2 ${className}`} {...rest}>
      <Text className="font-medium">{label}</Text>
      <TouchableOpacity
        className="flex flex-row items-center border-secondary border-2 bg-tertiary rounded-xl p-3 justify-between"
        onPress={() => setActive(true)}
      >
        <Text
          className={`font-medium ${
            value ? "text-black" : "text-text_secondary"
          }`}
        >
          {value ? moment(value).format("HH:mm") : placeholder}
        </Text>
        <Feather name="clock" size={20} color={colors.text_secondary} />
      </TouchableOpacity>
      {active ? (
        <DateTimePickerModal
          mode="time"
          isVisible={active}
          onCancel={() => setActive(false)}
          onConfirm={(selectedTime) => {
            setValue(selectedTime);
            setActive(false);
          }}
          minimumDate={minimumDate}
        />
      ) : (
        <></>
      )}
      <ConditionalError error={error} />
    </View>
  );
};

export default TimeInput;
