import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/index";
import {
  getDocs,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";
import HabitButton from "components/buttons/HabitButton";
import moment from "moment";
import { useOverview } from "providers/OverviewProvider";

const HabitList = ({ className = "", ...rest }) => {
  const days = ["su", "mo", "tu", "we", "th", "fr", "sa"];
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedDay } = useOverview();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      let updated = false;
      const colRef = collection(db, "habits");
      const unsub = onSnapshot(colRef, () => {
        updated = true;
        getAndSetHabits(selectedDay);
      });
      if (!updated) getAndSetHabits(selectedDay);

      return () => {
        isMounted = false;
        unsub();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [selectedDay]);

  // return the habits that corrospond to the selectedDay
  const getAndSetHabits = async (selectedDay) => {
    // console.log(selectedDay);
    setLoading(true);

    const colRef = collection(db, "habits");

    const queryStartDate = query(colRef, where("startDate", "<=", selectedDay));

    const queryEndDate = query(colRef, where("endDate", ">=", selectedDay));

    try {
      const docRefStartDate = await getDocs(queryStartDate);
      const docRefEndDate = await getDocs(queryEndDate);

      const startDateDocs = [];
      docRefStartDate.forEach((doc) =>
        startDateDocs.push({ ...doc.data(), id: doc.id })
      );

      const endDateDocs = [];
      docRefEndDate.forEach((doc) =>
        endDateDocs.push({ ...doc.data(), id: doc.id })
      );

      //only add to state if entry is both in start and end date docs
      const mergedDocs = startDateDocs.filter((doc) =>
        endDateDocs.some((doc2) => doc.id === doc2.id)
      );

      //only display the habits where repeatOn is the selected day
      const repeatOnHabits = mergedDocs.filter(({ repeatOn }) =>
        repeatOn.includes(days[moment(selectedDay).day()])
      );

      const completedHabits = repeatOnHabits.map(({ completed, ...rest }) => ({
        ...rest,
        completed: completed.some(
          (x) => x === moment(selectedDay).format("DD-MM-YYYY")
        )
          ? true
          : false,
      }));

      setHabits(completedHabits);
      setRefreshing(false);
      setLoading(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setLoading(false);
  };

  return (
    <View className={`flex-1 space-y-3 ${className}`} {...rest}>
      <View className="flex flex-row space-x-2">
        <Text className="text-text_primary text-xl font-bold">
          Habits of the day
        </Text>
        {loading ? <ActivityIndicator /> : <></>}
      </View>
      <View className="flex-1">
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getAndSetHabits(selectedDay)}
            />
          }
          data={habits}
          extraData={selectedDay}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitButton
              className="w-full"
              {...item}
              indicateLoading={setLoading}
            />
          )}
          ItemSeparatorComponent={() => <View className="w-full h-3" />}
        />
      </View>
    </View>
  );
};

export default HabitList;
