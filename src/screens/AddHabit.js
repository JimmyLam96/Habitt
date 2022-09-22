import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import ReturnButton from "components/buttons/ReturnButton";
import TextInput from "components/input/TextInput";
import DateInput from "components/input/DateInput";
import Checkbox from "components/buttons/Checkbox";
import TimeInput from "components/input/TimeInput";
import Animated, {
  Layout,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/index";
import { useNavigation } from "@react-navigation/native";
import colors from "config/colors";
import randomColor from "randomcolor";
import RepeatOnView from "components/views/RepeatOnView";
import moment from "moment";

const AddHabit = () => {
  const [title, setTitle] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [timeType, setTimeType] = useState("anytime");
  const [repeatOn, setRepeatOn] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSetDays = (day) => {
    if (repeatOn.some((x) => x === day)) {
      setRepeatOn(repeatOn.filter((x) => x !== day));
    } else {
      setRepeatOn([...repeatOn, day]);
    }
  };

  const verifyInput = () => {
    // Validate
    let errors = {};

    if (!title || title === "") {
      errors.title = "Title can not be empty";
    }

    if (!startDate) {
      errors.startDate = "No start date selected";
    }

    if (!endDate) {
      errors.endDate = "No end date selected";
    }

    if (repeatOn.length <= 0) {
      errors.repeatOn = "No days selected for this habit";
    }

    if (timeType === "specific") {
      if (!startTime) errors.startTime = "No start time selected";
      if (!endTime) errors.endTime = "No end time selected";
    }

    setErrors(errors);

    // return true if there are no errors else false
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (verifyInput()) {
      const doc = {
        title,
        startDate,
        endDate,
        repeatOn,
        color: randomColor(),
        completed: [],
        ...(startTime && { startTime: startTime }),
        ...(endTime && { endTime: endTime }),
      };

      try {
        const docRef = await addDoc(collection(db, "habits"), doc);

        console.log("Document written with ID: ", docRef.id);

        navigation.goBack();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      setLoading(false);
    }
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View className="flex-1 bg-background justify-between">
      <ReturnButton />
      <View className="p-7 space-y-5 flex-1 justify-end">
        <Animated.Text
          layout={Layout.easing()}
          className="font-bold text-4xl text-text_primary pt-10"
        >
          Add new habit
        </Animated.Text>
        <TextInput
          layout={Layout.easing()}
          label="Habit title"
          onChangeText={(input) => {
            if (input !== "") {
              setErrors({ ...errors, title: undefined });
            }
            setTitle(input);
          }}
          value={title}
          error={errors.title}
        />
        <Animated.View
          layout={Layout.easing()}
          className="flex flex-row w-full justify-between"
        >
          <DateInput
            label="Start date"
            setDate={(selectedDate) => {
              setErrors({ ...errors, startDate: undefined });
              selectedDate.setHours(0, 0, 0, 0);
              setStartDate(selectedDate);
            }}
            date={startDate}
            error={errors.startDate}
          />
          <DateInput
            label="End date"
            setDate={(selectedDate) => {
              setErrors({ ...errors, endDate: undefined });
              selectedDate.setHours(23, 59, 59, 999);
              setEndDate(selectedDate);
            }}
            date={endDate}
            error={errors.endDate}
          />
        </Animated.View>
        <Animated.View layout={Layout.easing()} className="space-y-2">
          <Text className="text-text_primary text-lg font-bold">Time</Text>
          <View className="flex flex-row">
            <Checkbox
              label="Any time"
              className="w-1/2"
              value={timeType === "anytime"}
              onPress={() => {
                setTimeType("anytime");
              }}
            />
            <Checkbox
              label="Specific"
              className="w-1/2"
              value={timeType === "specific"}
              onPress={() => {
                setTimeType("specific");
              }}
            />
          </View>
        </Animated.View>
        {timeType === "specific" ? (
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown}
            layout={Layout.easing()}
            className="flex flex-row w-full justify-between"
          >
            <TimeInput
              label="Start time"
              className="w-2/5"
              placeholder="12:00"
              value={startTime}
              setValue={(selectedTime) => {
                setErrors({ ...errors, startTime: undefined });
                setStartTime(selectedTime);
              }}
              error={errors.startTime}
            />
            <TimeInput
              label="End time"
              className="w-2/5"
              placeholder="14:00"
              value={endTime}
              setValue={(selectedTime) => {
                setErrors({ ...errors, endTime: undefined });
                setEndTime(selectedTime);
              }}
              minimumDate={
                startTime ? moment(startTime).add(1, "m").toDate() : undefined
              }
              error={errors.endTime}
            />
          </Animated.View>
        ) : (
          <></>
        )}
        <Animated.View className="space-y-2" layout={Layout.easing()}>
          <Text
            className={`text-text_primary text-lg font-bold ${
              errors.repeatOn && "text-error"
            }`}
          >
            Repeat on
          </Text>
          <RepeatOnView
            days={repeatOn}
            setDays={(selectedDay) => {
              setErrors({ ...errors, repeatOn: undefined });
              handleSetDays(selectedDay);
            }}
            error={errors.repeatOn}
          />
        </Animated.View>
        <AnimatedTouchable
          layout={Layout.easing()}
          className={`flex justify-center items-center py-3 w-full rounded-2xl ${
            !loading && "bg-highlight_primary shadow-lg"
          }`}
          onPress={handleSubmit}
        >
          <View className="h-4">
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text className="font-semibold">Save</Text>
            )}
          </View>
        </AnimatedTouchable>
      </View>
    </View>
  );
};

export default AddHabit;
