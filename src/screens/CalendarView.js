import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import colors from "config/colors";
import { db } from "../../firebase";
import { Entypo } from "@expo/vector-icons";
import { getDocs, collection } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  Layout,
  FadeInRight,
  FadeOutLeft,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { invertColor } from "config/colors";
import SearchInput from "components/input/SearchInput";

const CalendarView = () => {
  const isFocused = useIsFocused();
  const [notShownHabits, setNotShownHabits] = useState([]);
  const [shownHabits, setShownHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;

    if (isMounted && isFocused) {
      getAndSetHabits();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedMonth, isFocused]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      markCalendar(selectedMonth, shownHabits);
    }

    return () => {
      isMounted = false;
    };
  }, [shownHabits]);

  const markCalendar = async (selectedMonth, allHabits) => {
    const monthlyCompletedHabits = await getCompletedHabits(selectedMonth);

    let mappedHabits = {};
    if (monthlyCompletedHabits !== null)
      mappedHabits = mapKeysToHabitColors(monthlyCompletedHabits, allHabits);

    setMarkedDates(mappedHabits);
  };

  const getAndSetHabits = async () => {
    setLoading(true);

    const allHabits = await getAllHabits();

    setShownHabits(allHabits);
    setNotShownHabits([]);
    setLoading(false);
  };

  // maps an object of keys to habit color objects
  // format : {
  //   "YYYY-MM-DD": ["ID"]
  // }
  const mapKeysToHabitColors = (keys, habits) => {
    let newObj = {};
    Object.entries(keys).forEach(
      ([key, value]) =>
        (newObj[key] = {
          dots: value.map((id) => ({
            color: habits.find((x) => x.id === id)?.color,
          })),
        })
    );
    return newObj;
  };

  // get the habits that have been completed for the given selectedDay
  const getCompletedHabits = async (selectedMonth) => {
    const docRef = collection(
      db,
      "completedHabits",
      selectedMonth.getFullYear().toString(),
      selectedMonth.getMonth().toString()
    );

    const docSnap = await getDocs(docRef);

    if (docSnap.size === 0) return null;

    const habits = {};
    // map all the docs from the backend to "YYYY-MM-DD" format
    docSnap.forEach((x) => {
      const key =
        selectedMonth.getFullYear().toString() +
        "-" +
        (selectedMonth.getMonth() + 1 < 10 ? "0" : "") +
        (selectedMonth.getMonth() + 1).toString() +
        "-" +
        (parseInt(x.id, 10) < 10 ? "0" : "") +
        x.id;
      habits[key] = x.data().habits;
    });

    return habits;
  };

  const getAllHabits = async () => {
    const colRef = collection(db, "habits");

    try {
      const docRef = await getDocs(colRef);

      const docs = [];
      docRef.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });

      return docs;
    } catch (e) {
      console.error("Error adding document: ", e);
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      className="relative space-y-2 flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text className="font-bold text-4xl text-text_primary">Calendar</Text>
        <Text className="font-bold text-lg text-text_secondary">
          Monthly progress
        </Text>
      </View>
      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        enableSwipeMonths
        displayLoadingIndicator={loading}
        theme={{
          textDayFontWeight: "500",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "500",
          todayTextColor: colors.highlight_primary,
          selectedDayBackgroundColor: colors.highlight_primary,
          arrowColor: colors.highlight_primary,
          "stylesheet.calendar.header": {
            week: {
              marginTop: 7,
              flexDirection: "row",
              justifyContent: "space-around",
              paddingHorizontal: 0,
            },
          },
        }}
        onMonthChange={(month) => {
          const newDate = new Date(month.dateString);
          newDate.setDate(1);
          setSelectedMonth(newDate);
        }}
      />
      <Text className="text-text_primary text-xl font-bold">Habits</Text>
      <SearchInput
        placeholder="Find / sort your habits"
        onChangeText={setSearchText}
      />

      {searchText && searchText !== "" ? (
        <View className="max-h-md">
          <Animated.ScrollView
            layout={Layout.easing()}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {notShownHabits
              .filter(({ title }) =>
                title.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((habit, index) => (
                <Animated.View
                  key={index}
                  layout={Layout.easing()}
                  entering={FadeInRight}
                  exiting={FadeOutLeft}
                  className="flex-row mr-2 space-x-2 items-center p-2 rounded-xl border-secondary border-2"
                  style={{ maxWidth: 200 }}
                >
                  <Text
                    className="font-semibold text-secondary"
                    style={{
                      flexShrink: 1,
                    }}
                    numberOfLines={1}
                  >
                    {habit.title}
                  </Text>

                  <Entypo
                    name="plus"
                    size={22}
                    color={colors.secondary}
                    onPress={() => {
                      setNotShownHabits((prev) =>
                        prev.filter(({ title }) => title !== habit.title)
                      );
                      setShownHabits((prev) => [...prev, habit]);
                    }}
                  />
                </Animated.View>
              ))}
          </Animated.ScrollView>
        </View>
      ) : (
        <></>
      )}
      <Animated.ScrollView>
        {shownHabits
          .filter(({ title }) =>
            title.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((habit, index) => (
            <Animated.View
              key={index}
              layout={Layout.duration(240).easing()}
              entering={FadeInDown}
              exiting={FadeOut}
              className="flex flex-row justify-between items-center p-2 rounded-xl my-1"
              style={{ backgroundColor: habit.color }}
            >
              <Text
                style={{
                  maxWidth: "85%",
                  color: invertColor(habit.color),
                }}
                numberOfLines={1}
                onPress={() =>
                  navigation.navigate("EditHabit", {
                    ...habit,
                  })
                }
              >
                {habit.title}
              </Text>
              <View className="flex-row space-x-1 items-center justify-center">
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={invertColor(habit.color)}
                  onPress={() =>
                    navigation.navigate("EditHabit", {
                      ...habit,
                    })
                  }
                />
                <Entypo
                  name="cross"
                  size={22}
                  color={invertColor(habit.color)}
                  onPress={() => {
                    setNotShownHabits((prev) => [...prev, habit]);
                    setShownHabits((prev) =>
                      prev.filter((x) => habit.id !== x.id)
                    );
                  }}
                />
              </View>
            </Animated.View>
          ))}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CalendarView;
