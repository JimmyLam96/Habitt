import React, { createContext, useContext, useState } from "react";
import { Text, View, SafeAreaView } from "react-native";
import moment from "moment";
import WeekView from "components/views/WeekView";
import ProgressionRings from "components/statusbars/ProgressionRings";
import HabitList from "components/lists/HabitList";

const Overview = () => {
  return (
    <SafeAreaView className="flex flex-1 flex-col space-y-6">
      <View>
        <Text className="font-bold text-4xl text-text_primary">Today</Text>
        <Text className="font-bold text-lg text-text_secondary">
          {moment().format("DD MMMM")}
        </Text>
      </View>
      <WeekView />
      <ProgressionRings />
      <HabitList />
    </SafeAreaView>
  );
};

export default Overview;
