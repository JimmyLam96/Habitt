import { Text, View } from "react-native";
import React from "react";
import TextButton from "components/buttons/TextButton";
import ConditionalError from "components/text/ConditionalError";

const RepeatOnView = ({
  days = [],
  setDays = (day = "") => {},
  error = "",
  ...rest
}) => {
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <View className="space-y-2">
      <View className="flex-row w-full justify-between" {...rest}>
        {weekDays.map((day, index) => (
          <TextButton key={index} onPress={() => setDays(day.toLowerCase())}>
            <Text
              className={`font-bold text-base ${
                days.some((x) => x === day.toLowerCase())
                  ? "text-highlight_primary"
                  : "text-text_secondary"
              }`}
            >
              {day}
            </Text>
          </TextButton>
        ))}
      </View>
      <ConditionalError error={error} />
    </View>
  );
};

export default RepeatOnView;
