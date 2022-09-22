import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import { useOverview } from "providers/OverviewProvider";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

function shadeColor(color, percent) {
  if (!color) return;
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

const calculateValue = (startDate, endDate, repeatOn, completed) => {
  const totalWeeksForCompletion = moment(endDate.toDate()).diff(
    moment(startDate.toDate()),
    "weeks"
  );

  const totalDaysForCompletion =
    (totalWeeksForCompletion === 0 ? 1 : totalWeeksForCompletion) *
    (repeatOn.length === 0 ? 7 : repeatOn.length);

  return (completed.length / totalDaysForCompletion) * 100;
};

const ProgressionRings = ({ className, ...rest }) => {
  const navigation = useNavigation();
  const { outerHabit, middleHabit, innerHabit } = useOverview();
  const outerValue = outerHabit
    ? calculateValue(
        outerHabit.startDate,
        outerHabit.endDate,
        outerHabit.repeatOn,
        outerHabit.completed
      )
    : 0;
  const middleValue = middleHabit
    ? calculateValue(
        middleHabit.startDate,
        middleHabit.endDate,
        middleHabit.repeatOn,
        middleHabit.completed
      )
    : 0;
  const innerValue = innerHabit
    ? calculateValue(
        innerHabit.startDate,
        innerHabit.endDate,
        innerHabit.repeatOn,
        innerHabit.completed
      )
    : 0;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-evenly ${className}`}
      onPress={() => navigation.navigate("ProgressionHabits")}
      {...rest}
    >
      <CircularProgressBase
        value={outerValue}
        radius={60}
        activeStrokeColor={outerHabit?.color}
        inActiveStrokeColor={shadeColor(outerHabit?.color, 70)}
        activeStrokeWidth={15}
        inActiveStrokeWidth={15}
        inActiveStrokeOpacity={0.2}
      >
        <CircularProgressBase
          value={middleValue}
          radius={40}
          activeStrokeColor={middleHabit?.color}
          inActiveStrokeColor={shadeColor(middleHabit?.color, 70)}
          activeStrokeWidth={15}
          inActiveStrokeWidth={15}
          inActiveStrokeOpacity={0.2}
        >
          <CircularProgressBase
            value={innerValue}
            radius={20}
            activeStrokeColor={innerHabit?.color}
            inActiveStrokeColor={shadeColor(innerHabit?.color, 70)}
            activeStrokeWidth={15}
            inActiveStrokeWidth={15}
            inActiveStrokeOpacity={0.2}
          />
        </CircularProgressBase>
      </CircularProgressBase>
      <View className="space-y-1">
        <Text className="font-bold text-xl">
          {((outerValue + middleValue + innerValue) / 3).toFixed()}%
        </Text>
        <Text className="font-bold text-text_secondary">
          {(outerValue === 100 ? 1 : 0) +
            (middleValue === 100 ? 1 : 0) +
            (innerValue === 100 ? 1 : 0)}{" "}
          out of 3 completed
        </Text>
        <Text className="text-text_primary text-xl font-bold">
          Your progress
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProgressionRings;
