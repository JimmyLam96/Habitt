import React, { useState } from "react";
import Checkbox from "./Checkbox";
import { Entypo } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import colors from "config/colors";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/index";
useOverview;
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useOverview } from "providers/OverviewProvider";

const HabitButton = ({
  id = "",
  title = "",
  completed = false,
  startDate = null,
  endDate = null,
  repeatOn = [],
  color = "",
  className = "",
  startTime = undefined,
  endTime = undefined,
  indicateLoading = () => {},
  ...rest
}) => {
  const { selectedDay } = useOverview();
  const navigation = useNavigation();

  const completeHabit = async () => {
    indicateLoading(true);

    const habitRef = doc(db, "habits", id);

    const docRef = doc(
      db,
      "completedHabits",
      selectedDay.getFullYear().toString(),
      selectedDay.getMonth().toString(),
      selectedDay.getDate().toString()
    );

    try {
      if (completed) {
        await updateDoc(habitRef, {
          completed: arrayRemove(moment(selectedDay).format("DD-MM-YYYY")),
        });
        await updateDoc(docRef, { habits: arrayRemove(id) });
      } else {
        const docRefExists = (await getDoc(docRef)).exists();
        if (docRefExists) await updateDoc(docRef, { habits: arrayUnion(id) });
        else await setDoc(docRef, { habits: [id] });

        await updateDoc(habitRef, {
          completed: arrayUnion(moment(selectedDay).format("DD-MM-YYYY")),
        });
      }
    } catch (e) {
      console.error("Error updating document: ", e);
    }

    indicateLoading(false);
  };

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      layout={Layout.easing()}
      className={`flex flex-row justify-between items-center p-6 py-8 rounded-3xl bg-tertiary ${className}`}
      {...rest}
    >
      <View className="flex flex-row items-center space-x-5 px-5 w-10/12 overflow-hidden text-ellipsis">
        <Checkbox value={completed} onPress={completeHabit} />
        <View className="space-y-1">
          <Text className="font-semibold text-base" numberOfLines={1}>
            {title}
          </Text>
          {startTime ? (
            <Text className="text-text_secondary font-semibold">
              {moment(startTime.toDate()).format("HH:mm")} -{" "}
              {moment(endTime.toDate()).format("HH:mm")}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </View>
      <TouchableOpacity>
        <Entypo
          name="dots-three-horizontal"
          size={24}
          color={colors.secondary}
          onPress={() =>
            navigation.navigate("EditHabit", {
              id,
              title,
              completed,
              startDate,
              endDate,
              repeatOn,
              color,
              startTime,
              endTime,
            })
          }
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default HabitButton;
