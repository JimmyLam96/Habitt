import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from "react-native-reanimated";
import ReturnButton from "components/buttons/ReturnButton";
import { useOverview } from "providers/OverviewProvider";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "config/colors";
import Checkbox from "components/buttons/Checkbox";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserSettings } from "providers/UserProvider";

const ProgressionHabits = () => {
  const { outerHabit, middleHabit, innerHabit, habits } = useOverview();
  const { setInnerHabitId, setMiddleHabitId, setOuterHabitId } =
    useUserSettings();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [expandOuter, setExpandOuter] = useState(false);
  const [expandMiddle, setExpandMiddle] = useState(false);
  const [expandInner, setExpandInner] = useState(false);

  const handleSubmit = async (key, id, callback) => {
    setLoading(true);

    const docRef = doc(db, "userSettings", "demo-user");
    try {
      await updateDoc(docRef, { [key]: id });
      callback();
    } catch (error) {
      console.error(
        "[ProgressionHabits]: Could not update " + key + " habit ,",
        error
      );
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 justify-between">
      <ReturnButton />

      <View className="p-7 space-y-4 flex-1 justify-end">
        <Animated.Text
          layout={Layout.easing()}
          className="font-bold text-4xl text-text_primary pt-10"
        >
          Progress settings
        </Animated.Text>

        {/* Outer ring section */}
        <Animated.View layout={Layout.easing()} className="space-y-2">
          <Text className="font-medium">Outer ring</Text>
          <TouchableOpacity
            className={`flex flex-row items-center ${
              expandOuter ? "border-highlight_primary" : "border-secondary"
            } border-2 bg-tertiary rounded-xl p-3 justify-between`}
            onPress={() => setExpandOuter(!expandOuter)}
          >
            <Text className="font-medium text-black">
              {outerHabit ? outerHabit.title : "Select habit"}
            </Text>
            <View className={expandOuter && "rotate-180"}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={colors.text_secondary}
              />
            </View>
          </TouchableOpacity>
          {expandOuter ? (
            <Animated.View
              entering={FadeInDown}
              exiting={FadeOutDown}
              className="h-44 rounded-lg border-2 border-secondary p-3 shadow-md bg-tertiary"
            >
              <FlatList
                data={habits}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row items-center my-1 space-x-2"
                    onPress={() =>
                      handleSubmit("outerHabit", item.id, () =>
                        setOuterHabitId(item.id)
                      )
                    }
                  >
                    <Checkbox
                      disabled
                      value={outerHabit && outerHabit.id === item.id}
                    />
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </Animated.View>
          ) : (
            <></>
          )}
        </Animated.View>

        {/* Middle ring section */}
        <Animated.View layout={Layout.easing()} className="space-y-2">
          <Text className="font-medium">Middle ring</Text>
          <TouchableOpacity
            className={`flex flex-row items-center ${
              expandMiddle ? "border-highlight_primary" : "border-secondary"
            } border-2 bg-tertiary rounded-xl p-3 justify-between`}
            onPress={() => setExpandMiddle(!expandMiddle)}
          >
            <Text className="font-medium text-black">
              {middleHabit ? middleHabit.title : "Select habit"}
            </Text>
            <View className={expandMiddle && "rotate-180"}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={colors.text_secondary}
              />
            </View>
          </TouchableOpacity>
          {expandMiddle ? (
            <Animated.View
              entering={FadeInDown}
              exiting={FadeOutDown}
              className="h-44 rounded-lg border-2 border-secondary p-3 shadow-md bg-tertiary"
            >
              <FlatList
                data={habits}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row gap-2 items-center my-1"
                    onPress={() =>
                      handleSubmit("middleHabit", item.id, () =>
                        setMiddleHabitId(item.id)
                      )
                    }
                  >
                    <Checkbox
                      disabled
                      value={middleHabit && middleHabit.id === item.id}
                    />
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </Animated.View>
          ) : (
            <></>
          )}
        </Animated.View>

        {/* Inner ring section */}
        <Animated.View layout={Layout.easing()} className="space-y-2">
          <Text className="font-medium">Inner ring</Text>
          <TouchableOpacity
            className={`flex flex-row items-center ${
              expandInner ? "border-highlight_primary" : "border-secondary"
            } border-2 bg-tertiary rounded-xl p-3 justify-between`}
            onPress={() => setExpandInner(!expandInner)}
          >
            <Text className="font-medium text-black">
              {innerHabit ? innerHabit.title : "Select habit"}
            </Text>
            <View className={expandInner && "rotate-180"}>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={colors.text_secondary}
              />
            </View>
          </TouchableOpacity>
          {expandInner ? (
            <Animated.View
              entering={FadeInDown}
              exiting={FadeOutDown}
              className="h-44 rounded-lg border-2 border-secondary p-3 shadow-md bg-tertiary"
            >
              <FlatList
                data={habits}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row gap-2 items-center my-1"
                    onPress={() =>
                      handleSubmit("innerHabit", item.id, () =>
                        setInnerHabitId(item.id)
                      )
                    }
                  >
                    <Checkbox
                      disabled
                      value={innerHabit && innerHabit.id === item.id}
                    />
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </Animated.View>
          ) : (
            <></>
          )}
        </Animated.View>
        <TouchableOpacity
          disabled={loading}
          className="rounded-xl bg-highlight_primary items-center justify-center p-3 shadow-md"
          onPress={() => navigation.goBack()}
        >
          <View className="h-4">
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text className="font-semibold">Return</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProgressionHabits;
