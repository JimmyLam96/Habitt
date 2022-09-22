import TextButton from "components/buttons/TextButton";
import React from "react";
import { View, Text } from "react-native";
import moment from "moment";
import { useOverview } from "providers/OverviewProvider";

const getWeekDates = () => {
  const current = new Date();
  const week = new Array();
  // Starting Monday not Sunday
  current.setDate(current.getDate() - current.getDay());
  for (var i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return week;
};

/* Still need to pass selected and set selected prop because the component
 *  is used twice, in AddHabit and Overview screens
 */
const WeekView = ({ className, ...rest }) => {
  const weekDates = getWeekDates();
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const { selectedDay, setSelectedDay } = useOverview();

  return (
    <View className="space-y-2" {...rest}>
      <View className={`flex flex-row justify-between ${className}`}>
        {weekDates.map((date, index) => {
          return (
            <TextButton
              key={index}
              onPress={() => {
                setSelectedDay(date);
              }}
            >
              <Text
                className={`font-medium text-lg text-text_secondary ${
                  selectedDay.getDate() === date.getDate() &&
                  "text-highlight_primary"
                }`}
              >
                {date.getDate()}
              </Text>
              <Text
                className={`text-sm text-text_secondary font-medium ${
                  selectedDay.getDate() === date.getDate() &&
                  "text-highlight_primary"
                }`}
              >
                {days[moment(date).day()]}
              </Text>
            </TextButton>
          );
        })}
      </View>
    </View>
  );
};

export default WeekView;
